import React from "react";

export function ScramjetLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-md flex-shrink-0 ${className}`}
    >
      <rect width="120" height="120" rx="16" fill="#0F131A" stroke="#1E2734" strokeWidth="1.5" />
      {/* Outer Ramp (Mach 3) */}
      <polygon points="30,88 42,32 54,32 42,88" fill="#1A222E" stroke="#8E9AA8" strokeWidth="1.5" />
      {/* Middle Ramp (Mach 6) */}
      <polygon points="50,88 62,22 74,22 62,88" fill="#283547" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Forward Hypersonic Blade (Mach 10) */}
      <polygon points="70,88 82,12 94,12 82,88" fill="#FF3E00" stroke="#FF3E00" strokeWidth="1.5" />
      {/* Supersonic Plasma Flow Bar traversing all 3 */}
      <line x1="18" y1="66" x2="102" y2="66" stroke="#FF7700" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="84" cy="66" r="4" fill="#FFFFFF" />
    </svg>
  );
}
