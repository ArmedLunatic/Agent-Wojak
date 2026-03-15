import { NextRequest, NextResponse } from "next/server";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";
import { PublicKey, Connection, Transaction } from "@solana/web3.js";
import crypto from "crypto";
import { invoiceStore } from "@/lib/invoice-store";

export async function POST(req: NextRequest) {
  try {
    const { userWallet } = await req.json();

    if (!userWallet || typeof userWallet !== "string") {
      return NextResponse.json({ error: "wallet address required" }, { status: 400 });
    }

    // Validate wallet address format
    let userPublicKey: PublicKey;
    try {
      userPublicKey = new PublicKey(userWallet);
    } catch {
      return NextResponse.json({ error: "invalid wallet address" }, { status: 400 });
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const agentMint = new PublicKey(process.env.AGENT_TOKEN_MINT_ADDRESS!);
    const currencyMint = new PublicKey(process.env.CURRENCY_MINT!);
    const agent = new PumpAgent(agentMint, "mainnet", connection);

    // 0.1 SOL = 100_000_000 lamports
    const amount = 100000000;
    const memo = crypto.randomInt(100000, 999999999999);
    const now = Math.floor(Date.now() / 1000);
    const startTime = now;
    const endTime = now + 86400; // 24h window

    const instructions = await agent.buildAcceptPaymentInstructions({
      user: userPublicKey,
      currencyMint,
      amount: String(amount),
      memo: String(memo),
      startTime: String(startTime),
      endTime: String(endTime),
    });

    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userPublicKey;
    tx.add(...instructions);

    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64");

    // Store invoice server-side (prevents tampering)
    const invoiceId = crypto.randomUUID();
    invoiceStore.set(invoiceId, {
      userWallet,
      amount,
      memo,
      startTime,
      endTime,
      consumed: false,
    });

    return NextResponse.json({
      transaction: serialized,
      invoiceId,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Payment create error:", msg);
    return NextResponse.json({ error: "failed to create payment" }, { status: 500 });
  }
}
