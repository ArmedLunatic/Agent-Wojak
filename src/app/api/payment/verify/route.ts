import { NextRequest, NextResponse } from "next/server";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";
import { PublicKey, Connection } from "@solana/web3.js";

export async function POST(req: NextRequest) {
  try {
    const { userWallet, invoice } = await req.json();

    if (!userWallet || !invoice) {
      return NextResponse.json({ error: "wallet and invoice required" }, { status: 400 });
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

    // Payment verified — generate random number
    const randomNumber = Math.floor(Math.random() * 1001);

    return NextResponse.json({ verified: true, randomNumber });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Payment verify error:", msg);
    return NextResponse.json({ error: "verification failed" }, { status: 500 });
  }
}
