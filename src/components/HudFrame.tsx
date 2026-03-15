"use client";

interface HudFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function HudFrame({ children, className = "" }: HudFrameProps) {
  return (
    <div className={`hud-frame ${className}`}>
      <span className="hud-corner-bl" />
      <span className="hud-corner-br" />
      {children}
    </div>
  );
}
