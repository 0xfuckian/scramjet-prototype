"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SolanaLaunchpad } from "../../types";

export function BentoGrid() {
  const [activeTab, setActiveTab] = useState<"ALL" | "CURVES" | "CPMM">("ALL");

  const launchpads: { name: string; type: string; feature: string }[] = [
    { name: "Meteora DBC", type: "Dynamic Curve", feature: "0.15% - 5.0% Dynamic Fee Pool + DLMM LP" },
    { name: "Pump.fun", type: "Bonding Curve", feature: "Off-Chain Create + 0.5% Creator Fee Claim" },
    { name: "Raydium LaunchLab", type: "CPMM / OpenBook", feature: "Platform Configs + Automated LP Lock" },
    { name: "Bags", type: "Meme Ecosystem", feature: "Multi-Recipient % Creator Fee Share" },
    { name: "LetsBonk", type: "Bonk Native", feature: "Custom Bonding Curve + Bonk Rewards" },
    { name: "StonkFun", type: "Token-2022", feature: "Transfer Fee Extensions + Auto Liquidity" },
    { name: "Printr", type: "Supply Scaler", feature: "100M / 1B / 10B Curve Supply Models" },
    { name: "Anoncoin", type: "Privacy Curve", feature: "Anon API key masked deployment" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
          High-Velocity Architecture
        </span>
        <h2 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
          Engineered to Outrun Competitors
        </h2>
        <p className="text-sm text-[#8E9AA8]">
          Four architectural breakthroughs designed to eliminate cluster flags, prevent snipers, and maximize creator profit.
        </p>
      </div>

      {/* Main 4-Card Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Card 1: Jito Block-0 Atomic Bundle (Col 7) */}
        <div className="md:col-span-7 rounded-xl border border-[#1C2533] bg-gradient-to-br from-[#0D1117] to-[#121721] p-6 flex flex-col justify-between hover:border-[#FF3E00]/40 transition-all group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/30 font-bold">
                JITO ATOMIC BLOCK-0
              </span>
              <span className="text-xs font-mono text-[#8E9AA8]">5 Global Engines</span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#FF3E00] transition-colors">
              Sub-Wallet Front-Running Defense
            </h3>
            <p className="text-xs text-[#8E9AA8] leading-relaxed">
              Bundles your token creation, developer buy, and sub-wallet entries into a single atomic Block-0 transaction. 
              Zero public mempool visibility protects your launch from sandwich bots and predatory snipers.
            </p>
          </div>

          {/* Visual Bundle Diagram */}
          <div className="mt-5 bg-[#08090C] p-3 rounded-lg border border-[#1C2533] font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-[#8E9AA8] text-[9px] pb-1 border-b border-[#1C2533]">
              <span>TX SEQUENCE IN BLOCK-0</span>
              <span className="text-[#31E3AC]">ATOMIC INCLUSION</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded bg-[#1C2533] flex items-center justify-center text-[10px] text-[#F8FAFC]">1</span>
              <span className="text-[#F8FAFC]">Deploy Token & Bonding Curve</span>
              <span className="ml-auto text-[10px] text-[#8E9AA8]">Slot +0</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded bg-[#FF3E00]/20 text-[#FF3E00] flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-[#FF3E00] font-semibold">Dev & Front MEV Buys (No Slippage)</span>
              <span className="ml-auto text-[10px] text-[#31E3AC]">Confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded bg-[#1C2533] flex items-center justify-center text-[10px] text-[#8E9AA8]">3</span>
              <span className="text-[#8E9AA8]">Jito Priority Tip Transfer</span>
              <span className="ml-auto text-[10px] text-[#8E9AA8]">Leader Bribe</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ghost Funder Anti-BubbleMap (Col 5) */}
        <div className="md:col-span-5 rounded-xl border border-[#1C2533] bg-gradient-to-br from-[#0D1117] to-[#121721] p-6 flex flex-col justify-between hover:border-[#FF3E00]/40 transition-all group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#31E3AC]/10 text-[#31E3AC] border border-[#31E3AC]/30 font-bold">
                ANTI-BUBBLEMAP
              </span>
              <span className="text-xs font-mono text-[#8E9AA8]">Ghost Funder</span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#FF3E00] transition-colors">
              Zero-Cluster Wallet Graph
            </h3>
            <p className="text-xs text-[#8E9AA8] leading-relaxed">
              Bypasses Photon, BullX, and BubbleMaps cluster warnings. Uses multi-hop Merkle relays, randomized funding gaps (30m–12h), and CEX API auto-withdrawals.
            </p>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-[#08090C] border border-[#1C2533] text-center font-mono space-y-1">
            <div className="text-[10px] text-[#8E9AA8]">BUBBLEMAPS DETECTION RISK</div>
            <div className="text-2xl font-black text-[#31E3AC]">0.0% CLUSTER</div>
            <div className="text-[9px] text-[#8E9AA8]">Organic independent wallet tree</div>
          </div>
        </div>

        {/* Card 3: 0.01 SOL Micro-Bundles (Col 5) */}
        <div className="md:col-span-5 rounded-xl border border-[#1C2533] bg-gradient-to-br from-[#0D1117] to-[#121721] p-6 flex flex-col justify-between hover:border-[#FF3E00]/40 transition-all group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF7700]/10 text-[#FF7700] border border-[#FF7700]/30 font-bold">
                MICRO-BUNDLING
              </span>
              <span className="text-xs font-mono text-[#8E9AA8]">Rent Reclaim</span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#FF3E00] transition-colors">
              0.01 SOL Entry vs Proxima 0.10
            </h3>
            <p className="text-xs text-[#8E9AA8] leading-relaxed">
              Why lock up 2.0+ SOL across 20 sub-wallets? SCRAMJET lowers the barrier to 0.01 SOL and automatically sweeps ~0.00204 SOL ATA rent back to your vault post-sale.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center font-mono">
            <div className="p-2.5 rounded bg-[#08090C] border border-[#1C2533]">
              <div className="text-[9px] text-[#8E9AA8]">PROXIMA LOCKUP</div>
              <div className="text-base font-bold text-[#FF2A55]">0.10 SOL / w</div>
            </div>
            <div className="p-2.5 rounded bg-[#08090C] border border-[#FF3E00]/40">
              <div className="text-[9px] text-[#FF3E00]">SCRAMJET</div>
              <div className="text-base font-bold text-[#31E3AC]">0.01 SOL / w</div>
            </div>
          </div>
        </div>

        {/* Card 4: Automated Fee Buyback & Burn Flywheel (Col 7) */}
        <div className="md:col-span-7 rounded-xl border border-[#1C2533] bg-gradient-to-br from-[#0D1117] to-[#121721] p-6 flex flex-col justify-between hover:border-[#FF3E00]/40 transition-all group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/30 font-bold">
                DEFLATIONARY FLYWHEEL
              </span>
              <span className="text-xs font-mono text-[#8E9AA8]">Auto-Burn Loop</span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#FF3E00] transition-colors">
              Creator Fee Buyback & Burn
            </h3>
            <p className="text-xs text-[#8E9AA8] leading-relaxed">
              Don't just extract fees as passive SOL. Automatically channel 25%–100% of claimed fees into bonding curve market buys, instantly executing SPL token burns to fuel upward chart momentum.
            </p>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-[#08090C] border border-[#1C2533] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
              <span className="text-[#F8FAFC]">Trading Volume Fees</span>
            </div>
            <span className="text-[#8E9AA8]">→</span>
            <div className="text-[#FF7700] font-semibold">Curve Market Buy</div>
            <span className="text-[#8E9AA8]">→</span>
            <div className="text-[#31E3AC] font-bold">SPL Supply Burned 🔥</div>
          </div>
        </div>
      </div>

      {/* 12 Launchpad Supported Matrix */}
      <div className="rounded-xl border border-[#1C2533] bg-[#0D1117]/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1C2533] pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#F8FAFC] uppercase tracking-wider">
              12 Solana Launchpad Protocols Supported
            </h3>
            <p className="text-[11px] text-[#8E9AA8]">
              Deploy across any bonding curve or AMM pool with native instruction builders.
            </p>
          </div>
          <Link
            href="/launch"
            className="text-[11px] font-mono font-bold text-[#FF3E00] hover:text-[#FF7700] transition-colors"
          >
            Open Launch Wizard →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          {launchpads.map((lp, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#08090C] border border-[#1C2533] hover:border-[#FF3E00]/40 transition-colors space-y-1"
            >
              <div className="font-bold text-[#F8FAFC] text-[11px]">{lp.name}</div>
              <div className="text-[9px] text-[#FF3E00] uppercase font-semibold">{lp.type}</div>
              <div className="text-[10px] text-[#8E9AA8] leading-tight line-clamp-2">{lp.feature}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
