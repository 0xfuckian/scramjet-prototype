"use client";

import React, { useState } from "react";
import { calculateProtocolFee } from "../../lib/feeRouter";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function SavingsCalculator() {
  const [volumeSol, setVolumeSol] = useState(15);
  const SOL_PRICE_USD = 93.85;

  const lamports = BigInt(Math.floor(volumeSol * LAMPORTS_PER_SOL));
  const calc = calculateProtocolFee(lamports);

  const scramjetFeeUsd = (calc.feeSol * SOL_PRICE_USD).toFixed(2);
  const proximaFeeUsd = (calc.proximaTaxSol * SOL_PRICE_USD).toFixed(2);
  const userSavingsUsd = (calc.userSavingsSol * SOL_PRICE_USD).toFixed(2);

  return (
    <div className="rounded-xl border border-[#1C2533] bg-[#0D1117]/90 backdrop-blur-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#1C2533] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-semibold">
            Interactive Fee Benchmark
          </span>
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            SCRAMJET vs Proxima Savings Simulator
          </h3>
        </div>
        <div className="bg-[#FF3E00]/10 border border-[#FF3E00]/30 text-[#FF3E00] text-xs font-mono font-bold px-3 py-1 rounded-full">
          30% LOWER PLATFORM FEES
        </div>
      </div>

      {/* Slider Controls */}
      <div className="space-y-3">
        <div className="flex justify-between items-center font-mono text-xs">
          <span className="text-[#8E9AA8]">Simulated Launch Commitment:</span>
          <span className="text-xl font-bold text-[#F8FAFC]">{volumeSol} SOL</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={volumeSol}
          onChange={(e) => setVolumeSol(Number(e.target.value))}
          className="w-full accent-[#FF3E00] cursor-pointer h-2 bg-[#1C2533] rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#8E9AA8]">
          <span>1 SOL</span>
          <span>25 SOL</span>
          <span>50 SOL</span>
        </div>
      </div>

      {/* Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        {/* Proxima Card */}
        <div className="bg-[#08090C] border border-[#1C2533] p-4 rounded-lg space-y-1">
          <div className="text-[10px] font-mono uppercase text-[#8E9AA8]">Proxima Fee (5.0%)</div>
          <div className="text-lg font-bold text-[#8E9AA8] font-mono">
            {calc.proximaTaxSol.toFixed(3)} SOL
          </div>
          <div className="text-[11px] text-[#4A5568] font-mono">≈ ${proximaFeeUsd}</div>
        </div>

        {/* SCRAMJET Card */}
        <div className="bg-[#08090C] border border-[#FF3E00]/40 p-4 rounded-lg space-y-1 shadow-[0_0_15px_rgba(255,62,0,0.15)]">
          <div className="text-[10px] font-mono uppercase text-[#FF3E00] font-semibold">
            SCRAMJET Fee (3.5%)
          </div>
          <div className="text-lg font-bold text-[#F8FAFC] font-mono">
            {calc.feeSol.toFixed(3)} SOL
          </div>
          <div className="text-[11px] text-[#31E3AC] font-mono font-semibold">≈ ${scramjetFeeUsd}</div>
        </div>

        {/* User Savings Card */}
        <div className="bg-gradient-to-br from-[#FF3E00]/20 to-[#FF7700]/10 border border-[#FF3E00]/40 p-4 rounded-lg space-y-1">
          <div className="text-[10px] font-mono uppercase text-[#F8FAFC] font-semibold">
            Direct Developer Savings
          </div>
          <div className="text-xl font-black text-[#FF3E00] font-mono">
            +{calc.userSavingsSol.toFixed(3)} SOL
          </div>
          <div className="text-[11px] text-[#31E3AC] font-mono font-bold">
            +${userSavingsUsd} USD Pocketed
          </div>
        </div>
      </div>
    </div>
  );
}
