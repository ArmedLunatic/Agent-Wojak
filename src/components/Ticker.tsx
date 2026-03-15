"use client";

export function Ticker() {
  const items = [
    "$AgentJak",
    "SOLANA",
    "NGMI",
    "WAGMI",
    "IT&apos;S SO OVER",
    "WE&apos;RE SO BACK",
    "DEGEN MODE",
    "FEEL THE MARKET",
    "SER PLS",
    "TO THE MOON",
    "PROBABLY NOTHING",
    "GN",
  ];

  // Double the items so the scroll loops seamlessly
  const tickerText = items.join(" \u25C6 ");

  return (
    <div className="overflow-hidden border-y border-cyan-primary/10 bg-bg-surface py-2">
      <div className="ticker whitespace-nowrap">
        <span className="font-mono text-[rgba(0,212,255,0.4)] text-xs tracking-widest">
          {tickerText} &nbsp;&#9670;&nbsp; {tickerText} &nbsp;&#9670;&nbsp;{" "}
        </span>
      </div>
    </div>
  );
}
