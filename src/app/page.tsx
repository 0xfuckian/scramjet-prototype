"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SavingsCalculator } from "../components/home/SavingsCalculator";

export default function HomePage() {
  const [tokenAddressInput, setTokenAddressInput] = useState(
    "ED5nyyWEZpPWiMP8vYm7sD7TD3LAt3Q3gRTWHZPJBY"
  );

  const supportedLaunchpads = [
    { name: "Pump.fun", icon: "/icons/dex/pumpfun.webp" },
    { name: "Meteora DBC", icon: "/icons/dex/meteoradbc.webp" },
    { name: "Raydium LaunchLab", icon: "/icons/dex/raydium.webp" },
    { name: "Bags", icon: "/icons/dex/bags.webp" },
    { name: "LetsBonk", icon: "/icons/dex/bonkfun.webp" },
    { name: "StonkFun", icon: "/icons/dex/stonkfun.webp" },
    { name: "Anoncoin", icon: "/icons/dex/anoncoin.webp" },
    { name: "Surge", icon: "/icons/dex/surge.webp" },
  ];

  return (
    <div className="bg-[#07080B] text-[#F8FAFC] font-sans selection:bg-[#FF3E00]/30 selection:text-white">
      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-16 px-6 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3E00]/10 border border-[#FF3E00]/30 text-[#FF3E00] text-xs font-mono font-bold tracking-wider uppercase">
          <span>SOLANA MAINNET BETA // 3.5% PROTOCOL FEE</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#F8FAFC] leading-[1.06]">
          Hypersonic Solana Launches. <br />
          <span className="bg-gradient-to-r from-[#FF3E00] via-[#FF7700] to-[#F8FAFC] bg-clip-text text-transparent">
            Zero $45k Retainers.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#8E9AA8] max-w-2xl mx-auto leading-relaxed">
          The first mathematically unclusterable Solana launchpad. 3.5% platform fee (30% less than Proxima), 
          0.01 SOL sub-wallet micro-funding, and cryptographic Merkle relay trees that bypass BubbleMaps detection 
          without paying off analytics firms.
        </p>

        {/* Live on Solana & Key Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-[#8E9AA8]">
          <div className="flex items-center gap-2">
            <span>Live on</span>
            <div className="flex items-center gap-1.5">
              <img src="/icons/chains/sol.webp" alt="Solana" className="w-4 h-4 object-contain" />
              <span className="text-[#31E3AC] font-bold">Solana</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#F8FAFC]">
            <span className="text-[#636879]">Secured by</span>
            <span className="font-bold">turnkey</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#31E3AC]">
            <span className="text-[#636879]">Platform Fee:</span>
            <span className="font-bold font-mono">3.5% (-30% vs Proxima)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FF3E00]">
            <span className="text-[#636879]">Min Funding:</span>
            <span className="font-bold font-mono">0.01 SOL (10x lower)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/launch"
            className="h-[44px] px-8 rounded-lg bg-[#FF3E00] hover:bg-[#FF5500] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,62,0,0.4)] flex items-center justify-center"
          >
            Launch a Token Now →
          </Link>
          <Link
            href="/workspace"
            className="h-[44px] px-8 rounded-lg bg-[#0E0F14] hover:bg-[#161720] border border-[#1A1C25] hover:border-[#FF3E00]/50 text-[#F8FAFC] font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center"
          >
            Live Terminal HUD
          </Link>
        </div>

        {/* Product Terminal Hero Mockup */}
        <div className="pt-8 text-left">
          <div className="rounded-xl border border-[#1A1C25] bg-[#0E0F14] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
            {/* Mockup Header Bar */}
            <div className="h-10 px-4 border-b border-[#1A1C25] bg-[#0A0B0E] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#F8FAFC]">$SCRAM</span>
                <span className="text-[11px] text-[#717686]">Scramjet Mach 3.5 · Mainnet Live</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-[11px]">
                <span className="text-[#8E9AA8]">MCap: <strong className="text-[#F8FAFC]">$84.2K</strong></span>
                <span className="text-[#8E9AA8]">Fee: <strong className="text-[#31E3AC]">3.5%</strong></span>
                <span className="text-[#8E9AA8]">Min: <strong className="text-[#FF3E00]">0.01 SOL</strong></span>
                <span className="text-[#31E3AC]">Rent Reclaim: +0.00204 SOL</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/launch" className="text-[10px] bg-[#FF3E00] text-black font-bold px-2.5 py-1 rounded">
                  Create Launch
                </Link>
              </div>
            </div>

            {/* Mockup Body: Chart on Left, Trade Panel on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[360px] bg-[#08090C]">
              {/* Simulated Chart */}
              <div className="lg:col-span-2 border-r border-[#1A1C25] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#717686]">
                  <span>1M · 5M · 15M · 1H</span>
                  <span className="text-[#31E3AC]">● JITO BLOCK-0 CONFIRMED</span>
                </div>

                {/* Candlestick Waveform */}
                <div className="flex items-end justify-between h-44 px-2 gap-1.5 opacity-90">
                  {[40, 48, 42, 60, 55, 75, 70, 95, 88, 120, 110, 145, 138, 170, 160, 195, 180, 220, 210, 240].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-[1px] h-3 bg-[#31E3AC]/40" />
                      <div
                        style={{ height: `${h * 0.65}px` }}
                        className={`w-full rounded-sm ${i % 3 === 0 ? "bg-[#FF2A55]" : "bg-[#31E3AC]"}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#717686] pt-2 border-t border-[#1A1C25]">
                  <span>BubbleMaps Cluster Risk: <strong className="text-[#31E3AC]">0.0%</strong></span>
                  <span className="text-[#31E3AC] font-bold">5 JITO BLOCK ENGINES ONLINE</span>
                </div>
              </div>

              {/* Right Mini Trade Cockpit */}
              <div className="p-4 space-y-3 font-mono text-xs hidden lg:block bg-[#0D0E13]">
                <div className="flex justify-between items-center text-[11px] pb-1 border-b border-[#1A1C25]">
                  <span className="text-[#8E9AA8]">Sub-Wallets (Cohort 1)</span>
                  <span className="text-[#31E3AC]">24 Active</span>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between p-1.5 rounded bg-[#101117] border border-[#1A1C25]">
                    <span className="text-[#8E9AA8]">Deployer</span>
                    <span className="font-bold text-[#F8FAFC]">2.50 SOL</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-[#101117] border border-[#1A1C25]">
                    <span className="text-[#FF3E00]">Front MEV (2w)</span>
                    <span className="font-bold text-[#F8FAFC]">0.50 SOL</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-[#101117] border border-[#1A1C25]">
                    <span className="text-[#38BDF8]">Back MEV (4w)</span>
                    <span className="font-bold text-[#F8FAFC]">1.00 SOL</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-[#101117] border border-[#1A1C25]">
                    <span className="text-[#31E3AC]">Holders (18w)</span>
                    <span className="font-bold text-[#F8FAFC]">0.18 SOL (0.01 min)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/launch"
                    className="w-full h-8 rounded bg-[#FF3E00] hover:bg-[#FF5500] text-black font-bold text-[11px] flex items-center justify-center transition-all shadow-[0_0_12px_rgba(255,62,0,0.3)]"
                  >
                    Open Launch Wizard →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. THE RECEIPTS: $45K/MO PROXIMA BUBBLEMAPS DEAL ================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#14161F] text-left space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2A55]/10 border border-[#FF2A55]/30 text-[#FF2A55] text-xs font-mono font-bold">
            <span>THE RECEIPTS // BUBBLEMAPS ENTERPRISE SOW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8FAFC]">
            Proxima Pays BubbleMaps $45,000 / Month. <br />
            <span className="text-[#8E9AA8]">We Built Real Cryptographic Independence.</span>
          </h2>
          <p className="text-sm text-[#8E9AA8] max-w-3xl leading-relaxed">
            Since April 2025, Proxima Tools has been on a recurring $45,000/month retainer with BubbleMaps SAS 
            for "automated clustering parameters" and "block-level bundle processing visibility" (Exhibit A Statement of Work). 
            When detection algorithms shift, their entire platform goes into emergency maintenance. 
            SCRAMJET doesn't pay off analytics firms—we engineer mathematically unclusterable Merkle relay trees.
          </p>
        </div>

        {/* 3 Evidence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Evidence 1: The Contract */}
          <div className="p-5 rounded-xl border border-[#22242F] bg-[#0E0F14] space-y-3">
            <div className="flex justify-between items-center text-[10px] text-[#717686]">
              <span>SIGNED: APRIL 11, 2025</span>
              <span className="text-[#FF2A55] font-bold">EXHIBIT A</span>
            </div>
            <div className="font-bold text-sm text-[#F8FAFC]">
              $45,000 / Month Retainer
            </div>
            <p className="text-[11px] text-[#8E9AA8] leading-relaxed">
              Section 3.1: Proxima pays BubbleMaps $45,000 USD monthly for 25 hours of advisory ($1,800/hr excess) 
              covering bi-weekly audits of "automated clustering parameters" and liquidity distribution telemetry.
            </p>
            <div className="text-[10px] text-[#565B6D] pt-2 border-t border-[#1C202B]">
              Signers: Théo Martin (Proxima CEO) &amp; Nicolas Vaiman (Bubblemaps CEO)
            </div>
          </div>

          {/* Evidence 2: The Telegram Leak */}
          <div className="p-5 rounded-xl border border-[#22242F] bg-[#0E0F14] space-y-3">
            <div className="flex justify-between items-center text-[10px] text-[#717686]">
              <span>TELEGRAM: MAY 19, 2025</span>
              <span className="text-[#FF7700] font-bold">THE LEAK</span>
            </div>
            <div className="font-bold text-sm text-[#F8FAFC]">
              "InsightX Patched Us"
            </div>
            <blockquote className="text-[11px] text-[#8E9AA8] leading-relaxed italic border-l-2 border-[#FF7700] pl-2.5">
              "InsightX (Bubblemaps) has fixed the technique that most bundlers were using to stay undetected. 
              We've put Proxima into maintenance while we find a new solution..."
            </blockquote>
            <div className="text-[10px] text-[#565B6D] pt-2 border-t border-[#1C202B]">
              Public announcement from !Theo to Proxima users
            </div>
          </div>

          {/* Evidence 3: The SCRAMJET Solution */}
          <div className="p-5 rounded-xl border border-[#FF3E00]/40 bg-[#0E0F14] space-y-3 shadow-[0_0_20px_rgba(255,62,0,0.1)]">
            <div className="flex justify-between items-center text-[10px] text-[#FF3E00]">
              <span>SCRAMJET ENGINE</span>
              <span className="font-bold">ZERO BRIBES</span>
            </div>
            <div className="font-bold text-sm text-[#F8FAFC]">
              Cryptographic Relay Trees
            </div>
            <p className="text-[11px] text-[#8E9AA8] leading-relaxed">
              We don't rely on backroom whitelists. Our Ghost Funder breaks wallet graphs via multi-hop Merkle relays, 
              randomized timestamp spacing (30m–12h), and 0.01 SOL micro-funding that leaves zero single-parent links.
            </p>
            <div className="text-[10px] text-[#31E3AC] pt-2 border-t border-[#1C202B] font-bold">
              100% On-Chain Mathematical Independence
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. SCRAMJET KEY DIFFERENCES & UPGRADES ================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#14161F] text-left space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#161720] border border-[#22242F] text-[#8E9AA8]">
            Feature Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]">
            SCRAMJET vs Proxima: High-Leverage Upgrades
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Upgrade 1: Platform Fee */}
          <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-[#F8FAFC]">1. Platform Fee (30% Lower)</span>
              <span className="text-[#31E3AC] font-bold">3.5% vs 5.0%</span>
            </div>
            <p className="text-[#8E9AA8] text-[11px] leading-relaxed">
              Proxima takes 5.0% (500 bps) on every creator fee harvest. SCRAMJET charges only 3.5% (350 bps), 
              putting 30% more SOL directly back into developer pockets on every trade.
            </p>
          </div>

          {/* Upgrade 2: Sub-Wallet Minimum */}
          <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-[#F8FAFC]">2. Sub-Wallet Micro-Funding</span>
              <span className="text-[#FF3E00] font-bold">0.01 SOL vs 0.10 SOL</span>
            </div>
            <p className="text-[#8E9AA8] text-[11px] leading-relaxed">
              Proxima forces an arbitrary 0.10 SOL (~$9.50) lockup per sub-wallet. Across 20 wallets, that ties up 2.0+ SOL. 
              SCRAMJET allows 0.01 SOL (~$0.95) micro-subwallets, cutting capital requirements by 90%.
            </p>
          </div>

          {/* Upgrade 3: Rent Reclaim */}
          <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-[#F8FAFC]">3. Automated Rent Reclamation</span>
              <span className="text-[#31E3AC] font-bold">+0.00204 SOL / Wallet</span>
            </div>
            <p className="text-[#8E9AA8] text-[11px] leading-relaxed">
              When sub-wallets liquidate on legacy tools, your Associated Token Account (ATA) rent is abandoned. 
              SCRAMJET automatically batch-closes empty token accounts post-sale, refunding rent straight to your vault.
            </p>
          </div>

          {/* Upgrade 4: AMM Automations */}
          <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-[#F8FAFC]">4. Built-In Market Maker Suite</span>
              <span className="text-[#38BDF8] font-bold">Photon Bump Bot + Green TWAP</span>
            </div>
            <p className="text-[#8E9AA8] text-[11px] leading-relaxed">
              Proxima leaves you with manual trades after launch. SCRAMJET features an automated micro-buy bumper 
              to keep you trending on Photon and a Green-Candle TWAP that only liquidates inventory into green price delta.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4. INTERACTIVE SAVINGS CALCULATOR ================= */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-[#14161F]">
        <SavingsCalculator />
      </section>

      {/* ================= 5. LAUNCH ACROSS 12 LAUNCHPADS ================= */}
      <section className="py-16 border-t border-[#14161F] bg-[#0A0B0E] text-center space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight uppercase">
            Deploy Across 12 Solana Protocols
          </h3>
          <p className="text-xs text-[#8E9AA8]">
            Full native instruction builders for bonding curves, dynamic fee tiers, and AMMs.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 px-6 max-w-5xl mx-auto">
          {supportedLaunchpads.map((lp, idx) => (
            <Link
              key={idx}
              href="/launch"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1A1C25] bg-[#0E0F14] hover:border-[#FF3E00]/40 text-xs font-semibold text-[#8E9AA8] hover:text-[#F8FAFC] transition-all"
            >
              <img src={lp.icon} alt={lp.name} className="w-5 h-5 object-contain rounded" />
              <span>{lp.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= 6. FINAL CALL TO ACTION ================= */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black text-[#F8FAFC] tracking-tight uppercase">
          Ready to Outrun the Cartel?
        </h2>
        <p className="text-sm text-[#8E9AA8] max-w-xl mx-auto leading-relaxed">
          Launch with Jito Block-0 atomic guarantee, 0.01 SOL micro-subwallets, and zero backroom analytics deals.
        </p>
        <div className="pt-2">
          <Link
            href="/launch"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#FF3E00] hover:bg-[#FF5500] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,62,0,0.4)] hover:scale-105"
          >
            <span>Launch on Solana Now →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}



