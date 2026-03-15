"use client";

export function Ticker() {
  const items = [
    "$AgentJak", "FEELS PROTOCOL", "WAGMI", "HE BOUGHT?", "DUMP IT",
    "BOBO LURKING", "MUMU RISING", "DOOMER ARC", "TOUCH GRASS",
    "NGMI", "I KNOW THAT FEEL",
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
