import { NextRequest, NextResponse } from "next/server";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";
import { PublicKey, Connection, Transaction } from "@solana/web3.js";

export async function POST(req: NextRequest) {
  try {
    const { userWallet } = await req.json();

    if (!userWallet) {
      return NextResponse.json({ error: "wallet address required" }, { status: 400 });
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const agentMint = new PublicKey(process.env.AGENT_TOKEN_MINT_ADDRESS!);
    const currencyMint = new PublicKey(process.env.CURRENCY_MINT!);
    const agent = new PumpAgent(agentMint, "mainnet", connection);
    const userPublicKey = new PublicKey(userWallet);

    // 0.1 SOL = 100_000_000 lamports
    const amount = "100000000";
    const memo = String(Math.floor(Math.random() * 900000000000) + 100000);
    const now = Math.floor(Date.now() / 1000);
    const startTime = String(now);
    const endTime = String(now + 86400); // 24h window

    const instructions = await agent.buildAcceptPaymentInstructions({
      user: userPublicKey,
      currencyMint,
      amount,
      memo,
      startTime,
      endTime,
    });

    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userPublicKey;
    tx.add(...instructions);

    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64");

    return NextResponse.json({
      transaction: serialized,
      invoice: {
        amount: Number(amount),
        memo: Number(memo),
        startTime: Number(startTime),
        endTime: Number(endTime),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Payment create error:", msg);
    return NextResponse.json({ error: "failed to create payment" }, { status: 500 });
  }
}
