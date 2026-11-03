"use client";

import React, { useState, useEffect } from "react";
import { useLaunchStore } from "../../lib/stores/useLaunchStore";

export function MachGauge() {
  const currentSlot = useLaunchStore((state) => state.currentSlot);
  const startSlotFeed = useLaunchStore((state) => state.startSlotFeed);
  const [mach, setMach] = useState(3.52);

  useEffect(() => {
    startSlotFeed();
  }, [startSlotFeed]);

  // Subtle hypersonic speed micro-oscillation (3.50 - 3.56)
  useEffect(() => {
    const interval = setInterval(() => {
      setMach(Number((3.5 + Math.random() * 0.08).toFixed(2)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const blockEngines = [
    { city: "Frankfurt", code: "FRA", ping: "12ms", status: "OPT" },
    { city: "Amsterdam", code: "AMS", ping: "14ms", status: "OPT" },
    { city: "New York", code: "NYC", ping: "8ms", status: "OPT" },
    { city: "Tokyo", code: "TYO", ping: "22ms", status: "OPT" },
    { city: "Salt Lake", code: "SLC", ping: "6ms", status: "OPT" },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1C2533] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-2xl space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1C2533] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3E00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3E00]" />
          </span>
          <span className="font-mono text-[#8E9AA8] uppercase text-[10px] tracking-wider">
            Telemetry Feed // Block-0 Radar
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#31E3AC] flex items-center gap-1">
          <span>SLOT:</span>
          <span className="font-bold">{currentSlot > 0 ? currentSlot.toLocaleString() : "464,750,820"}</span>
        </div>
      </div>

      {/* Main Speed Gauge & Readout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Speed Dial Visualizer */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer SVG Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#1C2533"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#machGradient)"
                strokeWidth="6"
                strokeDasharray="251.2"
                strokeDashoffset="60"
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="machGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7700" />
                  <stop offset="100%" stopColor="#FF3E00" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#8E9AA8] font-mono leading-none">VELOCITY</span>
              <span className="text-xl font-black text-[#F8FAFC] font-mono tracking-tight mt-0.5">
                {mach}
              </span>
              <span className="text-[9px] text-[#FF3E00] font-bold font-mono">MACH</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-[10px] text-[#8E9AA8] uppercase tracking-wider font-mono">
              Hypersonic Status
            </div>
            <div className="text-sm font-bold text-[#F8FAFC]">CASCADE ACTIVE</div>
            <div className="text-[11px] text-[#8E9AA8] leading-tight">
              Atomic Block-0 bundling guarantees sub-wallet placement ahead of public snipers.
            </div>
          </div>
        </div>

        {/* Global Block Engine Latency Grid */}
        <div className="space-y-1.5 bg-[#08090C]/60 p-3 rounded-lg border border-[#1C2533]/80">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#8E9AA8] mb-1">
            <span>REGIONAL JITO BLOCK ENGINES</span>
            <span className="text-[#31E3AC]">5/5 ONLINE</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px]">
            {blockEngines.map((e, idx) => (
              <div key={idx} className="bg-[#0D1117] border border-[#1C2533] p-1.5 rounded">
                <div className="text-[#8E9AA8] text-[9px]">{e.code}</div>
                <div className="font-bold text-[#F8FAFC] my-0.5">{e.ping}</div>
                <div className="text-[#31E3AC] text-[8px] font-bold">{e.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
