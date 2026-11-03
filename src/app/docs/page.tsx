"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ScramjetLogo } from "../../components/brand/ScramjetLogo";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<
    "overview" | "launchpads" | "block0" | "funder" | "automations" | "fees" | "api"
  >("overview");

  const sections = [
    { id: "overview", title: "1. Architecture & Overview" },
    { id: "launchpads", title: "2. 12 Solana Launchpads" },
    { id: "block0", title: "3. Jito Block-0 MEV Bundler" },
    { id: "funder", title: "4. Ghost Funder & 0.01 SOL" },
    { id: "automations", title: "5. AMM Bump Bot & Green TWAP" },
    { id: "fees", title: "6. Creator Fee Buyback Flywheel" },
    { id: "api", title: "7. Turnkey & Helius API Setup" },
  ];

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        
        {/* Left Sticky Documentation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#1A1C25]">
            <ScramjetLogo size={24} />
            <div>
              <div className="font-bold text-xs text-[#F8FAFC]">SCRAMJET DOCS</div>
              <div className="text-[10px] font-mono text-[#8E9AA8]">v1.0.0 SPECIFICATION</div>
            </div>
          </div>

          <nav className="space-y-1 font-mono text-xs">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  activeSection === sec.id
                    ? "bg-[#FF3E00]/20 text-[#FF3E00] font-bold border border-[#FF3E00]/40"
                    : "text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#121319]"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#1A1C25] space-y-2">
            <Link
              href="/launch"
              className="w-full h-8 rounded-lg bg-[#FF3E00] hover:bg-[#FF5500] text-black font-bold text-xs flex items-center justify-center transition-all shadow-[0_0_12px_rgba(255,62,0,0.3)]"
            >
              Open Launchpad →
            </Link>
          </div>
        </aside>

        {/* Right Documentation Content */}
        <main className="flex-1 space-y-10 leading-relaxed text-xs">
          
          {/* SECTION 1: OVERVIEW */}
          {activeSection === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-bold">
                  System Overview
                </span>
                <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
                  SCRAMJET Architecture
                </h1>
                <p className="text-sm text-[#8E9AA8] leading-relaxed">
                  SCRAMJET is an all-in-one Solana token launchpad, atomic Block-0 MEV bundle orchestrator, and creator fee protocol engineered to outperform legacy tools like Proxima.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-3 font-mono">
                <div className="text-xs font-bold text-[#F8FAFC]">Key Economic Benchmark vs Proxima:</div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded bg-[#08090C] border border-[#1C202B]">
                    <div className="text-[#8E9AA8] text-[9px] uppercase">PROXIMA BASELINE</div>
                    <div className="text-sm font-bold text-[#FF2A55] mt-1">5.0% Platform Fee</div>
                    <div className="text-[10px] text-[#717686]">0.10 SOL / wallet lockup</div>
                  </div>
                  <div className="p-3 rounded bg-[#08090C] border border-[#FF3E00]/40">
                    <div className="text-[#FF3E00] text-[9px] uppercase font-bold">SCRAMJET ADVANTAGE</div>
                    <div className="text-sm font-bold text-[#31E3AC] mt-1">3.5% Platform Fee</div>
                    <div className="text-[10px] text-[#31E3AC]">0.01 SOL / wallet + Auto-Rent Reclaim</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LAUNCHPADS */}
          {activeSection === "launchpads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-bold">
                  Protocol Coverage
                </span>
                <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
                  12 Solana Launchpads
                </h1>
                <p className="text-sm text-[#8E9AA8] leading-relaxed">
                  SCRAMJET provides native instruction builders for all 12 Solana bonding curves and AMMs:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {[
                  { name: "Pump.fun", desc: "Bonding curve deployer, Off-Chain Create, Mayhem Mode, zaio split, and UsePaid streaming." },
                  { name: "Meteora DBC", desc: "Dynamic Bonding Curve with configurable 15–500 bps dynamic fee tiers and auto-DLMM graduation." },
                  { name: "Raydium LaunchLab", desc: "CPMM liquidity seeding, platform config address derivation, and automated LP locking." },
                  { name: "Bags", desc: "Native creator fee sharing with percentage allocations across handles and public keys." },
                  { name: "LetsBonk", desc: "Bonk ecosystem dynamic bonding curve with custom quote asset pairing (SOL/USD1)." },
                  { name: "StonkFun", desc: "Token-2022 transfer fee configuration, Standard and Rewards fee models." },
                ].map((lp, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-[#1A1C25] bg-[#0E0F14] space-y-1">
                    <div className="font-bold text-[#F8FAFC] text-sm">{lp.name}</div>
                    <div className="text-[11px] text-[#8E9AA8] leading-tight">{lp.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: BLOCK-0 */}
          {activeSection === "block0" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-bold">
                  MEV Engine
                </span>
                <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
                  Jito Block-0 Bundler
                </h1>
                <p className="text-sm text-[#8E9AA8] leading-relaxed">
                  Jito bundles permit up to 5 atomic transactions executed in the exact same slot. SCRAMJET assembles the deployment, developer buy, Front MEV buys, and validator tip into a single zero-mempool bundle.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-3 font-mono">
                <div className="text-xs font-bold text-[#F8FAFC]">5 Global Block Engine Endpoints:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 bg-[#08090C] rounded border border-[#1C202B]">Frankfurt (FRA)</div>
                  <div className="p-2 bg-[#08090C] rounded border border-[#1C202B]">Amsterdam (AMS)</div>
                  <div className="p-2 bg-[#08090C] rounded border border-[#1C202B]">New York (NYC)</div>
                  <div className="p-2 bg-[#08090C] rounded border border-[#1C202B]">Tokyo (TYO)</div>
                  <div className="p-2 bg-[#08090C] rounded border border-[#1C202B]">Salt Lake City (SLC)</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: FUNDER */}
          {activeSection === "funder" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-bold">
                  Anti-Clustering
                </span>
                <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
                  Ghost Funder &amp; 0.01 SOL Entry
                </h1>
                <p className="text-sm text-[#8E9AA8] leading-relaxed">
                  Proxima forces developers to fund sub-wallets from a single parent wallet, creating an immediate 1-degree cluster on BubbleMaps. Ghost Funder breaks this cluster entirely:
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14]">
                  <div className="font-bold text-[#F8FAFC] mb-1">1. Merkle Relay Tree:</div>
                  <div className="text-[#8E9AA8]">Funds disperse through rotating intermediate relay accounts with non-round randomized amounts (e.g. 1.83 SOL vs 2.0 SOL).</div>
                </div>
                <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14]">
                  <div className="font-bold text-[#F8FAFC] mb-1">2. 0.01 SOL Micro-Funding:</div>
                  <div className="text-[#8E9AA8]">Solana account rent is only ~0.00089 SOL. SCRAMJET lowers the minimum sub-wallet requirement from 0.10 SOL down to 0.01 SOL.</div>
                </div>
                <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14]">
                  <div className="font-bold text-[#F8FAFC] mb-1">3. Automated ATA Rent Reclaim:</div>
                  <div className="text-[#8E9AA8]">After sub-wallets liquidate, SCRAMJET automatically calls `close-account` to return ~0.00204 SOL rent per empty ATA back to your master vault.</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: AUTOMATIONS */}
          {activeSection === "automations" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-bold">
                  Market Making
                </span>
                <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
                  AMM Bump Bot &amp; Green TWAP
                </h1>
                <p className="text-sm text-[#8E9AA8] leading-relaxed">
                  Post-launch chart defense tools built directly into the Live Workspace:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2">
                  <div className="font-bold text-[#31E3AC] text-sm">Photon Bump Bot</div>
                  <div className="text-[#8E9AA8] leading-tight">
                    Schedules micro-buys from rotating sub-wallets every N seconds to keep your token at the top of Photon, BullX, and Pump.fun trending boards.
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2">
                  <div className="font-bold text-[#38BDF8] text-sm">Green-Candle TWAP</div>
                  <div className="text-[#8E9AA8] leading-tight">
                    Sub-wallets only execute micro-sells when the current candle delta is positive (green), preventing the single-candle "dev dumped" red crash.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: FEES */}
          {activeSection === "fees" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-bold">
                  Deflationary Loops
                </span>
                <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
                  Creator Fee Buyback Flywheel
                </h1>
                <p className="text-sm text-[#8E9AA8] leading-relaxed">
                  Instead of extracting fees purely as passive SOL, developers can configure automated buyback and burn splits on the bonding curve:
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2 font-mono text-xs">
                <div className="text-xs font-bold text-[#F8FAFC]">Execution Sequence:</div>
                <div className="text-[#8E9AA8]">1. Harvest creator trading fee from bonding curve vault.</div>
                <div className="text-[#8E9AA8]">2. 3.5% platform fee routed to vault: <code className="text-[#FF3E00]">CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq</code>.</div>
                <div className="text-[#8E9AA8]">3. Configured % of remaining fees immediately market-buys tokens on the curve.</div>
                <div className="text-[#8E9AA8]">4. Acquired tokens are immediately burned via SPL Token burn instructions.</div>
              </div>
            </div>
          )}

          {/* SECTION 7: API SETUP */}
          {activeSection === "api" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3E00] font-bold">
                  Infrastructure
                </span>
                <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight uppercase">
                  API &amp; Environment Setup
                </h1>
                <p className="text-sm text-[#8E9AA8] leading-relaxed">
                  SCRAMJET connects to Helius RPC and Turnkey AWS Nitro Enclaves for live transaction signing.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#1A1C25] bg-[#0E0F14] font-mono text-xs space-y-2 overflow-x-auto">
                <div className="text-xs font-bold text-[#F8FAFC]">Environment Keys (.env.local):</div>
                <pre className="text-[#8E9AA8] text-[11px]">
{`NEXT_PUBLIC_SOLANA_RPC_URL="https://mainnet.helius-rpc.com/?api-key=YOUR_KEY"
NEXT_PUBLIC_SOLANA_WS_URL="wss://mainnet.helius-rpc.com/?api-key=YOUR_KEY"
TURNKEY_ORGANIZATION_ID="5e495c5b-3486-4bbc-b84f-4286c6ab3a4a"
NEXT_PUBLIC_SCRAMJET_FEE_VAULT="CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq"`}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
