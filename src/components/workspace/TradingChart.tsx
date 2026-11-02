"use client";

import React, { useState } from "react";

interface TradingChartProps {
  mintAddress?: string;
  tokenSymbol?: string;
}

export function TradingChart({
  mintAddress = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  tokenSymbol = "SCRAM",
}: TradingChartProps) {
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h">("5m");
  const [chartSource, setChartSource] = useState<"DEXSCREENER" | "BIRDEYE">("DEXSCREENER");

  return (
    <div className="bg-scram-surface border border-scram-border rounded p-4 font-mono space-y-3">
      {/* Chart Top Controls */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-scram-stark">{tokenSymbol}/SOL</span>
          <span className="text-[10px] bg-scram-card px-2 py-0.5 rounded border border-scram-border text-scram-titanium">
            {mintAddress.slice(0, 6)}...{mintAddress.slice(-4)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Timeframe selector */}
          <div className="flex space-x-1 bg-scram-void p-0.5 rounded border border-scram-border text-[10px]">
            {(["1m", "5m", "15m", "1h"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded ${
                  timeframe === tf
                    ? "bg-scram-plasma text-black font-bold"
                    : "text-scram-titanium hover:text-scram-stark"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Provider toggle */}
          <div className="flex space-x-1 text-[10px]">
            <button
              onClick={() => setChartSource("DEXSCREENER")}
              className={`px-2 py-1 rounded border ${
                chartSource === "DEXSCREENER"
                  ? "border-scram-plasma text-scram-plasma bg-scram-plasma/10"
                  : "border-scram-border text-scram-titanium"
              }`}
            >
              DexScreener
            </button>
          </div>
        </div>
      </div>

      {/* Chart Frame */}
      <div className="relative w-full h-[400px] bg-scram-void rounded border border-scram-border overflow-hidden">
        <iframe
          src={`https://dexscreener.com/solana/${mintAddress}?embed=1&theme=dark&trades=0&info=0`}
          title={`${tokenSymbol} Live Chart`}
          className="w-full h-full border-0"
          loading="lazy"
        />

        {/* Floating Live Trade Markers Overlay */}
        <div className="absolute top-3 left-3 bg-scram-surface/90 border border-scram-border backdrop-blur px-2.5 py-1.5 rounded text-[10px] space-y-0.5 pointer-events-none">
          <div className="text-scram-titanium font-semibold uppercase text-[9px]">
            Sub-Wallet Trade Markers
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-bold">Front MEV Buy</span>
            <span className="text-scram-titanium">Slot +0</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-scram-plasma" />
            <span className="text-scram-plasma font-bold">Back MEV Buy</span>
            <span className="text-scram-titanium">Slot +2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
