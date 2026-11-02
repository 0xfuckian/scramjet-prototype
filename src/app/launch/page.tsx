"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SolanaLaunchpad,
  LaunchMode,
  BuildPreset,
  SniperGuardAction,
  NukeWalletScope,
} from "../../types";

export default function LaunchPage() {
  const [launchpad, setLaunchpad] = useState<SolanaLaunchpad>("METEORA_DBC");
  const [tokenName, setTokenName] = useState("SCRAM");
  const [tokenSymbol, setTokenSymbol] = useState("SCRAM");
  const [tokenDescription, setTokenDescription] = useState(
    "SCRAMJET Protocol Utility Token - Powering hypersonic launches on Solana."
  );

  // Launchpad-specific settings
  const [offChainCreate, setOffChainCreate] = useState(true);
  const [mayhemMode, setMayhemMode] = useState(false);
  const [zaioSplit, setZaioSplit] = useState(false);
  const [meteoraConfigKey, setMeteoraConfigKey] = useState(
    "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
  );
  const [dynamicFeeBps, setDynamicFeeBps] = useState(250); // 2.5%
  const [autoReinvestDlmm, setAutoReinvestDlmm] = useState(true);
  const [raydiumPlatformConfig, setRaydiumPlatformConfig] = useState("");
  const [raydiumCustomRaise, setRaydiumCustomRaise] = useState(85);

  // Launch Mode & Block-0
  const [launchMode, setLaunchMode] = useState<LaunchMode>("BLOCK_0");
  const [preset, setPreset] = useState<BuildPreset>("CLEAN_BUILD");
  const [backMevTuning, setBackMevTuning] = useState(40); // 0 (Less Sniper) to 100 (Less Top Trader)
  const [holderCount, setHolderCount] = useState(24);
  const [devBuySol, setDevBuySol] = useState(2.5);
  const [jitoTipTier, setJitoTipTier] = useState<"P50" | "P75" | "P90" | "CUSTOM">("P75");
  const [customTipSol, setCustomTipSol] = useState(0.015);

  // Sniper Guard
  const [sniperGuardEnabled, setSniperGuardEnabled] = useState(true);
  const [sniperTriggerSol, setSniperTriggerSol] = useState(5.0);
  const [sniperAction, setSniperAction] = useState<SniperGuardAction>("NUKE");
  const [nukeScope, setNukeScope] = useState<NukeWalletScope>("HOLDERS_ONLY");

  // Fee Strategy
  const [creatorSolPercent, setCreatorSolPercent] = useState(50);
  const [buybackBurnPercent, setBuybackBurnPercent] = useState(50);

  const launchpads: { id: SolanaLaunchpad; name: string; tag: string }[] = [
    { id: "METEORA_DBC", name: "Meteora DBC", tag: "Dynamic Curve / Recommended" },
    { id: "PUMP_FUN", name: "Pump.fun", tag: "Bonding Curve" },
    { id: "RAYDIUM_LAUNCHLAB", name: "Raydium LaunchLab", tag: "CPMM / OpenBook" },
    { id: "BAGS", name: "Bags", tag: "Creator Shares" },
    { id: "LETS_BONK", name: "LetsBonk", tag: "Bonk Ecosystem" },
    { id: "STONK_FUN", name: "StonkFun", tag: "Token-2022" },
    { id: "PRINTR", name: "Printr", tag: "Variable Curve" },
    { id: "ANONCOIN", name: "Anoncoin", tag: "Privacy First" },
    { id: "SURGE", name: "Surge", tag: "Low Cap Curve" },
    { id: "STOXES", name: "Stoxes", tag: "Multi-Wallet Split" },
    { id: "LESGO", name: "Lesgo", tag: "Community Curve" },
    { id: "MEME_FUN", name: "meme.fun", tag: "Degen Native" },
  ];

  const presets: { id: BuildPreset; title: string; desc: string }[] = [
    { id: "QUICK_BUILD", title: "Quick Build", desc: "Lower cost, rapid Front/Back layers, short delays." },
    { id: "CLEAN_BUILD", title: "Clean Build", desc: "Optimal anti-detection: longer delays, staggered funding." },
    { id: "FULL_BUILD", title: "Full Build", desc: "Maximum complexity: adds temporary holder transit layer." },
    { id: "CUSTOM", title: "Custom", desc: "Granular control over each MEV tier and block delay." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-scram-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-scram-stark uppercase tracking-wider">
            Create Hypersonic Launch
          </h1>
          <p className="text-scram-titanium text-[11px] mt-0.5">
            Configure multi-venue deployment, Jito Block-0 bundle, and fee flywheel.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-scram-titanium">NETWORK:</span>{" "}
          <span className="text-emerald-400 font-bold">SOLANA MAINNET</span>
        </div>
      </div>

      {/* 1. Launchpad Matrix */}
      <div className="bg-scram-surface border border-scram-border p-5 rounded space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
            1. Select Launchpad (12 Venues Available)
          </span>
          <span className="text-scram-plasma text-[10px]">SCRAM Platform Fee: 3.5%</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {launchpads.map((lp) => (
            <button
              key={lp.id}
              onClick={() => setLaunchpad(lp.id)}
              className={`p-2.5 rounded text-left border transition-all ${
                launchpad === lp.id
                  ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark shadow-plasma"
                  : "border-scram-border bg-scram-card text-scram-titanium hover:border-scram-hover"
              }`}
            >
              <div className="font-semibold text-xs">{lp.name}</div>
              <div className="text-[9px] text-scram-titanium truncate">{lp.tag}</div>
            </button>
          ))}
        </div>

        {/* Dynamic Launchpad Options */}
        {launchpad === "METEORA_DBC" && (
          <div className="p-3 bg-scram-card border border-scram-border rounded space-y-3 mt-3">
            <div className="font-semibold text-scram-stark text-[11px] text-scram-plasma">
              Meteora DBC Configuration
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-scram-titanium block mb-1">Configuration Key</label>
                <input
                  type="text"
                  value={meteoraConfigKey}
                  onChange={(e) => setMeteoraConfigKey(e.target.value)}
                  className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-scram-titanium block mb-1">
                  Dynamic Fee: {(dynamicFeeBps / 100).toFixed(2)}% ({dynamicFeeBps} bps)
                </label>
                <input
                  type="range"
                  min="15"
                  max="500"
                  step="5"
                  value={dynamicFeeBps}
                  onChange={(e) => setDynamicFeeBps(Number(e.target.value))}
                  className="w-full accent-scram-plasma"
                />
              </div>
            </div>
            <label className="flex items-center space-x-2 text-[11px] text-scram-stark cursor-pointer">
              <input
                type="checkbox"
                checked={autoReinvestDlmm}
                onChange={(e) => setAutoReinvestDlmm(e.target.checked)}
                className="accent-scram-plasma"
              />
              <span>Auto-reinvest fees into Meteora DLMM Concentrated Liquidity</span>
            </label>
          </div>
        )}

        {launchpad === "PUMP_FUN" && (
          <div className="p-3 bg-scram-card border border-scram-border rounded space-y-2 mt-3">
            <div className="font-semibold text-scram-stark text-[11px] text-scram-plasma">
              Pump.fun Options
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 text-[11px] text-scram-stark cursor-pointer">
                <input
                  type="checkbox"
                  checked={offChainCreate}
                  onChange={(e) => setOffChainCreate(e.target.checked)}
                  className="accent-scram-plasma"
                />
                <span>Off-Chain Create (Mask dev as on-chain creator)</span>
              </label>
              <label className="flex items-center space-x-2 text-[11px] text-scram-stark cursor-pointer">
                <input
                  type="checkbox"
                  checked={mayhemMode}
                  onChange={(e) => setMayhemMode(e.target.checked)}
                  className="accent-scram-plasma"
                />
                <span>Mayhem Mode (Pump.fun AI 24h Bot)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 2. Token Details */}
      <div className="bg-scram-surface border border-scram-border p-5 rounded space-y-3">
        <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
          2. Token Metadata
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-scram-titanium block mb-1">Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
            />
          </div>
          <div>
            <label className="text-[10px] text-scram-titanium block mb-1">Ticker Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-scram-titanium block mb-1">Description</label>
            <textarea
              rows={2}
              value={tokenDescription}
              onChange={(e) => setTokenDescription(e.target.value)}
              className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
            />
          </div>
        </div>
      </div>

      {/* 3. Launch Mode & Block-0 */}
      <div className="bg-scram-surface border border-scram-border p-5 rounded space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
            3. Launch Mode & Block-0 MEV Configuration
          </span>
          <span className="text-[10px] text-emerald-400">JITO BUNDLE GUARANTEE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`p-3 rounded text-left border transition-all ${
                preset === p.id
                  ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark shadow-plasma"
                  : "border-scram-border bg-scram-card text-scram-titanium hover:border-scram-hover"
              }`}
            >
              <div className="font-semibold text-xs text-scram-stark">{p.title}</div>
              <div className="text-[9px] text-scram-titanium mt-1 leading-normal">{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Back MEV Tuning Slider */}
        <div className="p-3 bg-scram-card border border-scram-border rounded space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-scram-stark font-semibold">Back MEV Tuning Slider</span>
            <span className="text-scram-plasma font-mono">
              {backMevTuning < 50 ? "Less Sniper Markers" : "Less Top-Trader Visibility"} ({backMevTuning}%)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={backMevTuning}
            onChange={(e) => setBackMevTuning(Number(e.target.value))}
            className="w-full accent-scram-plasma"
          />
          <div className="flex justify-between text-[9px] text-scram-titanium">
            <span>← Fewer Sniper Sell Markers</span>
            <span>Less Top-Trader Cluster →</span>
          </div>
        </div>

        {/* Quantities & Jito Tip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-scram-titanium block mb-1">Developer Buy (SOL)</label>
            <input
              type="number"
              step="0.1"
              value={devBuySol}
              onChange={(e) => setDevBuySol(Number(e.target.value))}
              className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
            />
          </div>
          <div>
            <label className="text-[10px] text-scram-titanium block mb-1">Holder Wallets Count</label>
            <input
              type="number"
              value={holderCount}
              onChange={(e) => setHolderCount(Number(e.target.value))}
              className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
            />
          </div>
          <div>
            <label className="text-[10px] text-scram-titanium block mb-1">Jito Bribe (SOL)</label>
            <input
              type="number"
              step="0.005"
              value={customTipSol}
              onChange={(e) => setCustomTipSol(Number(e.target.value))}
              className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
            />
          </div>
        </div>
      </div>

      {/* 4. Sniper Guard & Fee Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sniper Guard */}
        <div className="bg-scram-surface border border-scram-border p-5 rounded space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
              Sniper Guard Defense
            </span>
            <input
              type="checkbox"
              checked={sniperGuardEnabled}
              onChange={(e) => setSniperGuardEnabled(e.target.checked)}
              className="accent-scram-plasma"
            />
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-scram-titanium block mb-1">
                External Buy Trigger Threshold (SOL)
              </label>
              <input
                type="number"
                step="0.5"
                value={sniperTriggerSol}
                onChange={(e) => setSniperTriggerSol(Number(e.target.value))}
                className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setSniperAction("NUKE")}
                className={`p-2 rounded border text-center ${
                  sniperAction === "NUKE"
                    ? "border-red-500 bg-red-500/10 text-red-400 font-bold"
                    : "border-scram-border bg-scram-card text-scram-titanium"
                }`}
              >
                Nuke Wallets
              </button>
              <button
                onClick={() => setSniperAction("COMPLETE_EARLY")}
                className={`p-2 rounded border text-center ${
                  sniperAction === "COMPLETE_EARLY"
                    ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark font-bold"
                    : "border-scram-border bg-scram-card text-scram-titanium"
                }`}
              >
                Complete Early
              </button>
            </div>
          </div>
        </div>

        {/* Creator Fee Strategy */}
        <div className="bg-scram-surface border border-scram-border p-5 rounded space-y-3">
          <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
            Creator Fee Realization
          </span>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-scram-titanium">Creator SOL Extraction</span>
                <span className="text-scram-stark font-bold">{creatorSolPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={creatorSolPercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCreatorSolPercent(val);
                  setBuybackBurnPercent(100 - val);
                }}
                className="w-full accent-scram-plasma"
              />
            </div>
            <div className="p-2.5 bg-scram-card border border-scram-border rounded flex justify-between items-center text-[11px]">
              <div>
                <div className="text-scram-stark font-semibold">Auto-Buyback & Burn</div>
                <div className="text-[9px] text-scram-titanium">Market buy on curve + SPL burn</div>
              </div>
              <div className="text-scram-plasma font-bold text-sm">{buybackBurnPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Launch Button */}
      <div className="pt-4 flex justify-end items-center space-x-4 border-t border-scram-border">
        <Link href="/" className="text-scram-titanium hover:text-scram-stark transition-colors">
          Cancel
        </Link>
        <button
          onClick={() => alert(`Launching ${tokenSymbol} on ${launchpad} via Block-0 bundle!`)}
          className="bg-scram-plasma hover:bg-scram-flare text-black font-bold px-8 py-3 rounded text-xs tracking-wider uppercase transition-all shadow-plasma"
        >
          Dispatch Block-0 Bundle →
        </button>
      </div>
    </div>
  );
}
