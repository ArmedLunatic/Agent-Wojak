"use client";

export function Ticker() {
  const items = [
    "$WOJAK",
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
  const tickerText = items.join(" \u00B7 ");

  return (
    <div className="overflow-hidden border-y border-green-900/40 bg-black/60 py-2">
      <div className="ticker whitespace-nowrap">
        <span className="text-green-600/70 text-xs tracking-widest">
          {tickerText} &nbsp;&middot;&nbsp; {tickerText} &nbsp;&middot;&nbsp;{" "}
        </span>
      </div>
    </div>
  );
}
