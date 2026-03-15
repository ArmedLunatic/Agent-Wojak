"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { motion, AnimatePresence } from "framer-motion";
import { HudFrame } from "@/components/HudFrame";

const HEX_CHARS = "0123456789ABCDEF";

function useDecryptNumber(num: number | null) {
  const [display, setDisplay] = useState<string>("");
  const [scrambling, setScrambling] = useState(false);

  useEffect(() => {
    if (num === null) {
      setDisplay("");
      setScrambling(false);
      return;
    }

    const finalStr = String(num);
    setScrambling(true);
    setDisplay("????");

    let iteration = 0;
    const totalIter = 11; // 8 scramble + 3 reveal
    const interval = setInterval(() => {
      iteration++;

      if (iteration <= 8) {
        // Pure scramble phase
        let scrambled = "";
        for (let i = 0; i < finalStr.length; i++) {
          scrambled += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        }
        setDisplay(scrambled);
      } else {
        // Reveal left-to-right phase (iterations 9, 10, 11)
        const revealCount = iteration - 8; // 1, 2, 3
        const revealed = finalStr.slice(0, revealCount);
        let rest = "";
        for (let i = revealCount; i < finalStr.length; i++) {
          rest += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        }
        setDisplay(revealed + rest);
      }

      if (iteration >= totalIter) {
        clearInterval(interval);
        setDisplay(finalStr);
        setScrambling(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [num]);

  return { display, scrambling };
}

export function RandomGenerator() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [step, setStep] = useState<"connect" | "pay" | "verifying" | "result">("connect");
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { display: decryptedDisplay } = useDecryptNumber(
    step === "result" ? randomNumber : null
  );

  const handlePay = useCallback(async () => {
    if (!publicKey || !signTransaction) return;
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment transaction on server
      const createRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userWallet: publicKey.toBase58() }),
      });

      if (!createRes.ok) {
        const data = await createRes.json().catch(() => null);
        throw new Error(data?.error || "Failed to create payment");
      }

      const { transaction: txBase64, invoiceId } = await createRes.json();

      // Step 2: Sign transaction with wallet
      const tx = Transaction.from(Buffer.from(txBase64, "base64"));
      const signedTx = await signTransaction(tx);

      // Step 3: Send transaction
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      const latestBlockhash = await connection.getLatestBlockhash("confirmed");
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      // Step 4: Verify payment server-side
      setStep("verifying");

      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          invoiceId,
        }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json().catch(() => null);
        throw new Error(data?.error || "Verification failed");
      }

      const { randomNumber: num } = await verifyRes.json();
      setRandomNumber(num);
      setStep("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "something went wrong ser";
      if (msg.includes("User rejected")) {
        setError("transaction cancelled ser. no worries.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  const handleReset = () => {
    setStep("pay");
    setRandomNumber(null);
    setError(null);
  };

  // Auto-advance from connect to pay when wallet connects
  if (publicKey && step === "connect") {
    setStep("pay");
  }

  return (
    <HudFrame>
      <div className="space-y-8 p-4">
        {/* Header */}
        <div className="font-mono text-sm text-cyan-primary tracking-wider text-center">
          ORACLE://ENTROPY_GENERATOR
        </div>

        {/* Payment cost display */}
        <div className="text-center">
          <span className="text-orange-accent font-mono text-sm">COST: 0.1 SOL</span>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center">
          <WalletMultiButton
            style={{
              backgroundColor: "rgba(0, 255, 240, 0.1)",
              border: "1px solid rgba(0, 255, 240, 0.4)",
              color: "#00FFF0",
              fontFamily: "monospace",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Pay Button */}
        <AnimatePresence mode="wait">
          {step === "pay" && (
            <motion.div
              key="pay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="border border-cyan-primary/20 rounded-lg p-6 bg-bg-surface">
                <p className="text-cyan-primary/70 text-sm mb-4">
                  {"\u27E9"} PAY 0.1 SOL TO GENERATE A RANDOM NUMBER (0-1000)
                </p>
                <p className="text-xs text-[rgba(255,255,255,0.25)] mb-6">
                  payment is verified on-chain via pump.fun agent payments sdk
                </p>
                <motion.button
                  onClick={handlePay}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="hud-btn hud-btn-accent disabled:opacity-50 text-lg"
                >
                  {loading ? "[PROCESSING...]" : "[PAY 0.1 SOL]"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4"
            >
              <div className="border border-cyan-primary/20 rounded-lg p-8 bg-bg-surface">
                <div className="text-2xl text-cyan-primary font-mono mb-4">VERIFYING ON-CHAIN...</div>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-cyan-primary rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-xs text-[rgba(255,255,255,0.25)] mt-4">
                  confirming transaction on solana...
                </p>
              </div>
            </motion.div>
          )}

          {step === "result" && randomNumber !== null && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center space-y-6"
            >
              <div className="border border-cyan-primary/40 rounded-lg p-8 bg-bg-surface hud-glow">
                <p className="text-xs text-[rgba(255,255,255,0.25)] mb-2">{"\u27E9"} YOUR NUMBER</p>
                <div className="text-cyan-primary font-mono text-4xl mb-4">
                  {decryptedDisplay}
                </div>
                <p className="text-xs text-[rgba(255,255,255,0.25)] mt-4">
                  payment verified on-chain. this number is yours ser.
                </p>
              </div>
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hud-btn hud-btn-primary text-sm"
              >
                [GENERATE ANOTHER]
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center border border-danger-red/40 rounded-lg p-4 bg-bg-surface"
          >
            <p className="text-danger-red text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-danger-red/50 mt-2 hover:text-danger-red transition-colors"
            >
              [DISMISS]
            </button>
          </motion.div>
        )}

        {/* How It Works */}
        <div data-readout className="border border-cyan-primary/10 rounded-lg p-4 text-xs text-[rgba(255,255,255,0.25)] bg-bg-surface">
          <p className="text-cyan-primary/60 mb-2">{"\u27E9"} HOW IT WORKS</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>connect your solana wallet (phantom, solflare)</li>
            <li>pay 0.1 SOL via pump.fun agent payments</li>
            <li>payment verified on-chain server-side</li>
            <li>receive your random number (0-1000)</li>
          </ol>
          <p className="mt-2 text-[rgba(255,255,255,0.15)]">
            revenue feeds $AgentJak automated buybacks + burn
          </p>
        </div>
      </div>
    </HudFrame>
  );
}
