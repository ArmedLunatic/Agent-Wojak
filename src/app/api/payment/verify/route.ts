import { NextRequest, NextResponse } from "next/server";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";
import { PublicKey, Connection } from "@solana/web3.js";
import crypto from "crypto";
import { invoiceStore } from "@/lib/invoice-store";

export async function POST(req: NextRequest) {
  try {
    const { userWallet, invoiceId } = await req.json();

    if (!userWallet || !invoiceId) {
      return NextResponse.json({ error: "wallet and invoiceId required" }, { status: 400 });
    }

    // Look up invoice server-side (prevents tampering)
    const invoice = invoiceStore.get(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: "invoice not found or expired" }, { status: 404 });
    }

    // Prevent replay attacks
    if (invoice.consumed) {
      return NextResponse.json({ error: "invoice already used" }, { status: 409 });
    }

    // Verify wallet matches
    if (invoice.userWallet !== userWallet) {
      return NextResponse.json({ error: "wallet mismatch" }, { status: 403 });
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const agentMint = new PublicKey(process.env.AGENT_TOKEN_MINT_ADDRESS!);
    const currencyMint = new PublicKey(process.env.CURRENCY_MINT!);
    const agent = new PumpAgent(agentMint, "mainnet", connection);

    // Retry verification up to 10 times (blockchain confirmation delay)
    let verified = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      verified = await agent.validateInvoicePayment({
        user: new PublicKey(userWallet),
        currencyMint,
        amount: invoice.amount,
        memo: invoice.memo,
        startTime: invoice.startTime,
        endTime: invoice.endTime,
      });
      if (verified) break;
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!verified) {
      return NextResponse.json({ error: "payment not verified" }, { status: 402 });
    }

    // Mark invoice as consumed (prevents replay)
    invoice.consumed = true;
    invoiceStore.set(invoiceId, invoice);

    // Cryptographically secure random number
    const randomNumber = crypto.randomInt(0, 1001);

    return NextResponse.json({ verified: true, randomNumber });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Payment verify error:", msg);
    return NextResponse.json({ error: "verification failed" }, { status: 500 });
  }
}
