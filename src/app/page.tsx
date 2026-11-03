"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [tokenAddressInput, setTokenAddressInput] = useState(
    "ED5nyyWEZpPWiMP8vYm7sD7TD3LAt3Q3gRTWHZPJBY"
  );

  const supportedLaunchpads = [
    { name: "Pump.fun", icon: "/icons/dex/pumpfun.webp" },
    { name: "Meteora DBC", icon: "/icons/dex/meteoradbc.webp" },
    { name: "Raydium", icon: "/icons/dex/raydium.webp" },
    { name: "Four.meme", icon: "/icons/dex/fourmeme.webp" },
    { name: "LetsBonk", icon: "/icons/dex/bonkfun.webp" },
    { name: "Bags", icon: "/icons/dex/bags.webp" },
    { name: "StonkFun", icon: "/icons/dex/stonkfun.webp" },
    { name: "Pangea", icon: "/icons/dex/pangea.webp" },
  ];

  return (
    <div className="bg-[#07080B] text-[#F8FAFC] font-sans selection:bg-[#FF3E00]/30 selection:text-white">
      {/* ================= 1. HERO SECTION (Screenshot 1) ================= */}
      <section className="pt-20 pb-16 px-6 text-center max-w-5xl mx-auto space-y-6">
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-[#F8FAFC] leading-[1.08]">
          One platform. <br />
          Every token operation.
        </h1>
        <p className="text-base sm:text-lg text-[#8E9AA8] max-w-2xl mx-auto leading-relaxed">
          Launch across 12 launchpads. Manage wallets, trade, automate and monitor execution from one place.
        </p>

        {/* Live on & Secured by badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-[#8E9AA8]">
          <div className="flex items-center gap-2">
            <span>Live on</span>
            <div className="flex items-center gap-1.5">
              <img src="/icons/chains/sol.webp" alt="Solana" className="w-4 h-4 object-contain" />
              <img src="/icons/chains/base.webp" alt="Base" className="w-4 h-4 object-contain" />
              <img src="/icons/chains/eth.webp" alt="Ethereum" className="w-4 h-4 object-contain" />
              <img src="/icons/chains/bsc.webp" alt="BNB" className="w-4 h-4 object-contain" />
              <img src="/icons/chains/arc.webp" alt="Arc" className="w-4 h-4 object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#F8FAFC]">
            <span className="text-[#636879]">Secured by</span>
            <span className="font-bold">turnkey</span>
          </div>
        </div>

        {/* Product Terminal Hero Mockup (Screenshot 1) */}
        <div className="pt-8">
          <div className="rounded-xl border border-[#1A1C25] bg-[#0E0F14] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] text-left">
            {/* Mockup Header Bar */}
            <div className="h-10 px-4 border-b border-[#1A1C25] bg-[#0A0B0E] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#F8FAFC]">$SCRAM</span>
                <span className="text-[11px] text-[#717686]">Scramjet · 1day ago</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-[11px]">
                <span className="text-[#8E9AA8]">MCap: <strong className="text-[#F8FAFC]">$32.3K</strong></span>
                <span className="text-[#8E9AA8]">Price: <strong className="text-[#F8FAFC]">$0.04323</strong></span>
                <span className="text-[#8E9AA8]">Supply: <strong className="text-[#F8FAFC]">1B</strong></span>
                <span className="text-[#31E3AC]">65% Curve</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#161720] border border-[#22242F] px-2 py-0.5 rounded text-[#8E9AA8]">
                  Withdraw 11.489 SOL
                </span>
              </div>
            </div>

            {/* Mockup Body: Chart on Left, Trade Panel on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[380px] bg-[#08090C]">
              {/* Simulated Chart */}
              <div className="lg:col-span-2 border-r border-[#1A1C25] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#717686]">
                  <span>1M · 5M · 15M · 1H</span>
                  <span className="text-[#31E3AC]">● 0.2K/$21.4K BUYS</span>
                </div>

                {/* Candlestick Waveform */}
                <div className="flex items-end justify-between h-48 px-2 gap-1.5 opacity-90">
                  {[40, 48, 42, 60, 55, 75, 70, 95, 88, 120, 110, 145, 138, 170, 160, 195, 180, 220, 210, 240].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-[1px] h-3 bg-[#31E3AC]/40" />
                      <div
                        style={{ height: `${h * 0.7}px` }}
                        className={`w-full rounded-sm ${i % 3 === 0 ? "bg-[#FF2A55]" : "bg-[#31E3AC]"}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#717686] pt-2 border-t border-[#1A1C25]">
                  <span>Block-0 MEV Target: Slot +0</span>
                  <span className="text-[#31E3AC] font-bold">100% INCLUSION RATE</span>
                </div>
              </div>

              {/* Right Mini Trade Cockpit */}
              <div className="p-4 space-y-3 font-mono text-xs hidden lg:block bg-[#0D0E13]">
                <div className="grid grid-cols-2 gap-1 bg-[#14151C] p-1 rounded-md">
                  <div className="text-center py-1 rounded bg-[#1C202B] text-[#F8FAFC] font-semibold text-[11px]">Buy</div>
                  <div className="text-center py-1 rounded text-[#717686] text-[11px]">Sell</div>
                </div>

                <div className="flex justify-between text-[11px] text-[#8E9AA8]">
                  <span>Holders</span>
                  <span className="text-[#F8FAFC]">12.93%</span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px]">
                  {["0.1%", "1%", "3%", "MAX"].map((p) => (
                    <div key={p} className="p-1 rounded bg-[#14151C] border border-[#1A1C25] text-center text-[#8E9AA8]">
                      {p}
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded bg-[#101117] border border-[#1A1C25] space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#8E9AA8]">AutoSell</span>
                    <span className="text-[#31E3AC]">● Running</span>
                  </div>
                  <div className="text-sm font-bold text-[#31E3AC]">+0.071 SOL</div>
                </div>

                <Link
                  href="/workspace"
                  className="w-full h-8 rounded bg-[#FF3E00] hover:bg-[#FF5500] text-black font-bold text-[11px] flex items-center justify-center transition-all"
                >
                  Enter Workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. LAUNCH ACROSS 12 LAUNCHPADS (Screenshot 2) ================= */}
      <section className="py-12 border-y border-[#14161F] bg-[#0A0B0E] text-center space-y-5">
        <span className="text-[12px] font-mono text-[#8E9AA8]">Launch across 12 supported launchpads.</span>
        <div className="flex flex-wrap items-center justify-center gap-6 px-6 max-w-5xl mx-auto">
          {supportedLaunchpads.map((lp, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#8E9AA8] hover:text-[#F8FAFC] transition-colors">
              <img src={lp.icon} alt={lp.name} className="w-5 h-5 object-contain rounded" />
              <span>{lp.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. WALLET PREPARATION (Screenshot 3) ================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 text-left">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#161720] border border-[#22242F] text-[#8E9AA8]">
            Wallet preparation
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#F8FAFC]">
            Prepare every wallet.
          </h2>
          <p className="text-sm text-[#8E9AA8] leading-relaxed max-w-md">
            Source wallets, monitor balances and fund them from one place with zero on-chain clustering.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs text-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <span className="text-[#FF3E00]">✦</span>
              <span>CEX Funding (Binance, KuCoin, OKX, Bybit)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#FF3E00]">✦</span>
              <span>Wallet Marketplace <strong className="text-[9px] bg-[#FF3E00]/20 text-[#FF3E00] px-1.5 py-0.5 rounded font-mono ml-1">NEW</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#FF3E00]">✦</span>
              <span>Live Multi-Wallet Monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#FF3E00]">✦</span>
              <span>Bulk Funding &amp; Automated Rent Reclaim</span>
            </div>
          </div>
        </div>

        {/* Right CEX Wallet Preview Card */}
        <div className="rounded-xl border border-[#1A1C25] bg-[#0E0F14] p-5 space-y-2.5 font-mono text-xs shadow-xl">
          <div className="flex justify-between items-center text-[11px] text-[#717686] pb-2 border-b border-[#1A1C25]">
            <span>WALLET COHORT</span>
            <span>BALANCE</span>
          </div>
          {[
            { id: "Wallet #13", cex: "Htx", sol: "0.54 SOL" },
            { id: "Wallet #14", cex: "Mexc", sol: "2.72 SOL" },
            { id: "Wallet #15", cex: "Kucoin", sol: "1.08 SOL" },
            { id: "Wallet #16", cex: "Binance", sol: "4.12 SOL" },
            { id: "Wallet #17", cex: "Gate", sol: "0.84 SOL" },
            { id: "Wallet #18", cex: "Bybit", sol: "1.96 SOL" },
          ].map((w, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#08090C] border border-[#151720]">
              <div className="flex items-center gap-2.5">
                <span className="text-[#8E9AA8]">{w.id}</span>
                <span className="text-[10px] text-[#636879] px-1.5 rounded bg-[#121319]">{w.cex}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F8FAFC]">{w.sol}</span>
                <span className="w-2 h-2 rounded-full bg-[#31E3AC]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. LAUNCH SETUP (Screenshot 4) ================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-[#14161F]">
        <div className="space-y-5 text-left order-2 md:order-1">
          <div className="rounded-xl border border-[#1A1C25] bg-[#0E0F14] p-5 space-y-2.5 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {supportedLaunchpads.slice(0, 6).map((lp, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-[#1A1C25] bg-[#08090C] flex items-center gap-2 text-xs">
                  <img src={lp.icon} alt={lp.name} className="w-4 h-4 object-contain rounded" />
                  <span className="font-semibold text-[#F8FAFC]">{lp.name}</span>
                </div>
              ))}
            </div>
            <div className="text-center pt-2">
              <span className="text-[11px] font-mono text-[#717686]">Choose a chain and launchpad</span>
            </div>
          </div>
        </div>

        <div className="space-y-5 text-left order-1 md:order-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#161720] border border-[#22242F] text-[#8E9AA8]">
            Launch setup
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#F8FAFC]">
            Choose where <br /> and how to launch.
          </h2>
          <p className="text-sm text-[#8E9AA8] leading-relaxed max-w-md">
            Select a supported launchpad. Add token details. Set supply and launch controls.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs text-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <span className="text-[#31E3AC]">🛡</span>
              <span>Sniper Guard (Nuke &amp; Complete Early)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#FF7700]">⚡</span>
              <span>Block-0 Jito MEV Bundle Timing</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#38BDF8]">📄</span>
              <span>Token Metadata &amp; Supply Acquisition</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. POST-LAUNCH TRADING & AUTOMATION (Screenshot 5) ================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto space-y-12 border-t border-[#14161F]">
        <div className="text-left space-y-4 max-w-2xl">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#161720] border border-[#22242F] text-[#8E9AA8]">
            Post-launch
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#F8FAFC]">
            Monitor your positions. <br /> Automate your trades.
          </h2>
          <p className="text-sm text-[#8E9AA8] leading-relaxed">
            Track who's trading your token, manage your supply and positions, and automate your strategy. All in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-3">
            <span className="text-[10px] uppercase text-[#717686] font-semibold tracking-wider">MONITOR</span>
            <div className="space-y-2 text-[#F8FAFC]">
              <div>📊 Live Chart</div>
              <div>⚡ Trade Feed</div>
              <div>🎯 KOL Tracker</div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-3">
            <span className="text-[10px] uppercase text-[#717686] font-semibold tracking-wider">OPERATE</span>
            <div className="space-y-2 text-[#F8FAFC]">
              <div>🚀 Buy &amp; Sell (Stagger/Parallel)</div>
              <div>🔒 Supply Control (Streamflow)</div>
              <div>💰 Claim Rewards</div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-3">
            <span className="text-[10px] uppercase text-[#717686] font-semibold tracking-wider">AUTOMATE</span>
            <div className="space-y-2 text-[#F8FAFC]">
              <div>📉 AutoSell (Green TWAP)</div>
              <div>📈 AutoBuy (Photon Bump Bot)</div>
              <div>🔄 Volume Bot</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. SCRAMJET IN NUMBERS (Screenshot 6) ================= */}
      <section className="py-20 border-t border-[#14161F] bg-[#0A0B0E] text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#161720] border border-[#22242F] text-[#8E9AA8]">
            SCRAMJET in numbers
          </span>
          <h2 className="text-4xl font-semibold text-[#F8FAFC] tracking-tight">Built for real operations.</h2>
          <p className="text-xs font-mono text-[#8E9AA8]">Used to launch tokens, manage wallets and execute at scale.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto px-6 text-center font-mono">
          <div>
            <div className="text-4xl font-bold text-[#F8FAFC]">18 months</div>
            <div className="text-xs text-[#717686] mt-1">Live in production</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#F8FAFC]">4,500+</div>
            <div className="text-xs text-[#717686] mt-1">Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#31E3AC]">$240M+</div>
            <div className="text-xs text-[#717686] mt-1">Tracked user PnL</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#FF3E00]">90,000+</div>
            <div className="text-xs text-[#717686] mt-1">Token launches</div>
          </div>
        </div>
      </section>

      {/* ================= 7. ACTIVITY & TOKEN IMPORT (Screenshot 7) ================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#14161F]">
        {/* Activity Timeline Card */}
        <div className="rounded-xl border border-[#1A1C25] bg-[#0E0F14] p-6 space-y-4 text-left">
          <span className="text-xs font-mono text-[#8E9AA8]">Activity history</span>
          <h3 className="text-2xl font-bold text-[#F8FAFC]">See past and scheduled activity.</h3>
          <p className="text-xs text-[#717686]">Search actions, wallets and strategies in one timeline.</p>

          <div className="space-y-2 font-mono text-xs pt-2">
            {[
              { act: "Sniper Guard", det: "Plan", time: "3m ago" },
              { act: "Distribute", det: "2.52 → 7 Wallets", time: "3m ago" },
              { act: "Withdraw", det: "8.72 to your wallet", time: "2m ago" },
              { act: "AutoSell", det: "Run Organic", time: "2m ago" },
              { act: "Collect Fees", det: "1.284 SOL", time: "2m ago" },
            ].map((a, i) => (
              <div key={i} className="flex justify-between items-center p-2 rounded bg-[#08090C] border border-[#151720]">
                <span className="text-[#F8FAFC]">{a.act}</span>
                <span className="text-[#8E9AA8]">{a.det}</span>
                <span className="text-[#636879] text-[10px]">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Token Import Card */}
        <div className="rounded-xl border border-[#1A1C25] bg-[#0E0F14] p-6 space-y-4 text-left flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-mono text-[#8E9AA8]">Token import</span>
            <h3 className="text-2xl font-bold text-[#F8FAFC]">Already launched? <br />Start here.</h3>
            <p className="text-xs text-[#717686]">Import your token by its address. Configure your setup and buy directly from SCRAMJET.</p>

            <div className="space-y-1.5 font-mono text-xs pt-2">
              <label className="text-[10px] text-[#717686] uppercase">Token Address</label>
              <input
                type="text"
                value={tokenAddressInput}
                onChange={(e) => setTokenAddressInput(e.target.value)}
                className="w-full h-10 bg-[#08090C] border border-[#1A1C25] rounded-lg px-3 text-xs text-[#F8FAFC] outline-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#08090C] border border-[#31E3AC]/40 flex items-center justify-between font-mono text-xs">
              <div>
                <div className="font-bold text-[#F8FAFC]">$MOODENG <span className="font-normal text-[#8E9AA8]">Moo Deng</span></div>
                <div className="text-[10px] text-[#717686]">$44.5M Market cap</div>
              </div>
              <span className="text-[#31E3AC] text-sm">✓ Token imported</span>
            </div>
          </div>

          <Link
            href="/workspace"
            className="w-full h-10 rounded-lg bg-[#161722] hover:bg-[#1E202E] border border-[#232532] text-xs font-bold flex items-center justify-center transition-colors"
          >
            Launch in Workspace →
          </Link>
        </div>
      </section>

      {/* ================= 8. SECURITY & CONTROL (Screenshot 8) ================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#14161F] text-left">
        <div className="p-6 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2.5">
          <div className="flex items-center gap-1.5 text-sm font-bold text-[#F8FAFC]">
            <span>Secured by</span>
            <span>turnkey</span>
          </div>
          <p className="text-xs text-[#717686] leading-relaxed">
            Turnkey-powered non-custodial signing and 2FA help protect sensitive actions, from selling to withdrawals, without exposing private keys.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-2.5">
          <h3 className="text-sm font-bold text-[#F8FAFC]">Take back control.</h3>
          <p className="text-xs text-[#717686] leading-relaxed">
            You don't need a market maker to make your market. SCRAMJET gives you the tools to manage your own liquidity, volume and trading strategies.
          </p>
        </div>
      </section>
    </div>
  );
}


