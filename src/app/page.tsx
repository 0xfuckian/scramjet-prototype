"use client";

import React from "react";
import Link from "next/link";
import { HypersonicCanvas } from "../components/home/HypersonicCanvas";
import { MachGauge } from "../components/home/MachGauge";
import { BentoGrid } from "../components/home/BentoGrid";
import { SavingsCalculator } from "../components/home/SavingsCalculator";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#08090C] text-[#F8FAFC] overflow-hidden">
      {/* 1. Interactive Canvas Background (Particle Stream & Grid) */}
      <HypersonicCanvas />

      {/* 2. Main Foreground Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {/* Hero Section */}
        <div className="space-y-6 text-center max-w-4xl mx-auto pt-4">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF3E00]/10 border border-[#FF3E00]/30 shadow-[0_0_15px_rgba(255,62,0,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3E00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3E00]" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#FF3E00] uppercase">
              MACH 3.5 ENGINE // PROXIMA BENCHMARK SMASHED
            </span>
          </div>

          {/* Main Hero Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#F8FAFC] uppercase font-sans leading-[1.05]">
            Hypersonic Solana <br />
            <span className="bg-gradient-to-r from-[#FF3E00] via-[#FF7700] to-[#F8FAFC] bg-clip-text text-transparent">
              Token Launchpad
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E9AA8] max-w-2xl mx-auto font-sans leading-relaxed">
            Coordinated Jito Block-0 atomic bundles, zero-cluster Ghost Funder, 0.01 SOL micro-funding, and automated creator fee buyback loops. 
            All 12 Solana launchpads in one hypersonic terminal.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/launch"
              className="bg-[#FF3E00] hover:bg-[#FF5500] text-black font-extrabold px-8 py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,62,0,0.4)] hover:shadow-[0_0_35px_rgba(255,62,0,0.6)] hover:-translate-y-0.5"
            >
              Dispatch Launch →
            </Link>
            <Link
              href="/workspace"
              className="bg-[#0D1117] hover:bg-[#121721] border border-[#1C2533] hover:border-[#FF3E00]/50 text-[#F8FAFC] font-semibold px-8 py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all"
            >
              Live Workspace HUD
            </Link>
            <Link
              href="/marketplace"
              className="border border-[#1C2533] hover:border-[#FF7700]/50 text-[#8E9AA8] hover:text-[#F8FAFC] px-6 py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all"
            >
              Warmed Wallets
            </Link>
          </div>
        </div>

        {/* 3. Live Mach Gauge & Telemetry Feed */}
        <MachGauge />

        {/* 4. Awwwards Bento Grid & Architecture Pillars */}
        <BentoGrid />

        {/* 5. Interactive Fee Savings Calculator vs Proxima */}
        <SavingsCalculator />

        {/* 6. Bottom Call to Action Banner */}
        <div className="rounded-2xl border border-[#FF3E00]/30 bg-gradient-to-r from-[#FF3E00]/15 via-[#0D1117] to-[#FF7700]/10 p-8 sm:p-12 text-center space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3E00]/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] uppercase tracking-tight">
            Ready to Outrun the Memepool?
          </h2>
          <p className="text-sm text-[#8E9AA8] max-w-xl mx-auto">
            Zero cluster flags. Lowest platform fees. Guaranteed atomic Block-0 inclusion. 
            Connect your Turnkey enclave or Phantom wallet to begin.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/launch"
              className="bg-[#FF3E00] hover:bg-[#FF5500] text-black font-extrabold px-8 py-3 rounded-lg text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,62,0,0.4)]"
            >
              Start Launching Now →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

