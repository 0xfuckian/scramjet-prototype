"use client";

import React, { useState } from "react";
import { WalletFolder } from "../../types";

export default function FunderPage() {
  const [funderBalance, setFunderBalance] = useState(14.85);
  const [fundingMode, setFundingMode] = useState<"CEX_API_DIRECT" | "RELAY_MERKLE_TREE" | "CLASSIC">(
    "RELAY_MERKLE_TREE"
  );
  const [selectedExchange, setSelectedExchange] = useState<"OKX" | "BINANCE" | "BYBIT">("OKX");
  const [randomDeviation, setRandomDeviation] = useState(5); // ±5% jitter
  const [fundingGapMin, setFundingGapMin] = useState(30);

  // Micro-funding
  const [subWalletMinSol, setSubWalletMinSol] = useState(0.01);
  const [autoReclaimRent, setAutoReclaimRent] = useState(true);

  // Folder cohorts
  const [folders] = useState<WalletFolder[]>([
    { id: "box1", name: "box1 (Active Launch)", walletCount: 24, totalBalanceSol: 2.14 },
    { id: "mev-front", name: "mev-front (Block-0)", walletCount: 6, totalBalanceSol: 1.25 },
    { id: "holders", name: "holders (Long Term)", walletCount: 50, totalBalanceSol: 4.8 },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-mono text-xs space-y-6">
      <div className="flex justify-between items-center border-b border-scram-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-scram-stark uppercase tracking-wider">
            Funder & Sub-Wallet Manager
          </h1>
          <p className="text-scram-titanium text-[11px] mt-0.5">
            Ghost Funder dispersal, 0.01 SOL micro-funding, and automated ATA rent recovery.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-scram-titanium uppercase">Master Funder Balance</div>
          <div className="text-base font-bold text-emerald-400">{funderBalance} SOL</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Folders Manager */}
        <div className="space-y-4">
          <div className="bg-scram-surface border border-scram-border p-4 rounded space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
                Wallet Folders
              </span>
              <button
                onClick={() => alert("Creating new wallet folder")}
                className="text-[10px] bg-scram-plasma/10 text-scram-plasma border border-scram-plasma/30 px-2 py-0.5 rounded font-bold"
              >
                + New Folder
              </button>
            </div>

            <div className="space-y-2">
              {folders.map((f) => (
                <div
                  key={f.id}
                  className="p-3 bg-scram-card border border-scram-border hover:border-scram-hover rounded space-y-1 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-scram-stark text-xs">{f.name}</span>
                    <span className="text-[10px] text-scram-plasma font-bold">
                      {f.walletCount} wallets
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-scram-titanium">
                    <span>Balance: {f.totalBalanceSol} SOL</span>
                    <span>Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ATA Rent Reclaim Card */}
          <div className="bg-scram-surface border border-emerald-500/30 p-4 rounded space-y-2 bg-emerald-500/5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-400 text-xs">Automated Rent Reclamation</span>
              <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-scram-titanium leading-relaxed">
              When sub-wallets sell out, SCRAMJET automatically closes empty token accounts (ATAs),
              returning ~0.00204 SOL rent per wallet back to your funder.
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20 text-[11px]">
              <span className="text-scram-stark">Reclaimed Today:</span>
              <span className="text-emerald-400 font-bold font-mono">+0.1632 SOL</span>
            </div>
            <button
              onClick={() => alert("Scanned and reclaimed 8 empty ATAs across sub-wallets!")}
              className="w-full mt-2 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] uppercase tracking-wider"
            >
              Sweep Empty ATAs Now
            </button>
          </div>
        </div>

        {/* Right Columns: Ghost Funder & Micro-Funding Settings */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-scram-surface border border-scram-border p-5 rounded space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
                Ghost Funder (Anti-BubbleMap Engine)
              </span>
              <span className="text-scram-plasma text-[10px]">Zero Single-Parent Links</span>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFundingMode("RELAY_MERKLE_TREE")}
                className={`p-3 rounded border text-left ${
                  fundingMode === "RELAY_MERKLE_TREE"
                    ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark"
                    : "border-scram-border bg-scram-card text-scram-titanium"
                }`}
              >
                <div className="font-bold text-xs text-scram-stark">Relay Merkle Tree</div>
                <div className="text-[9px] text-scram-titanium mt-1">Multi-hop intermediary accounts</div>
              </button>

              <button
                onClick={() => setFundingMode("CEX_API_DIRECT")}
                className={`p-3 rounded border text-left ${
                  fundingMode === "CEX_API_DIRECT"
                    ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark"
                    : "border-scram-border bg-scram-card text-scram-titanium"
                }`}
              >
                <div className="font-bold text-xs text-scram-stark">Direct CEX API</div>
                <div className="text-[9px] text-scram-titanium mt-1">Direct withdrawal from exchange</div>
              </button>

              <button
                onClick={() => setFundingMode("CLASSIC")}
                className={`p-3 rounded border text-left ${
                  fundingMode === "CLASSIC"
                    ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark"
                    : "border-scram-border bg-scram-card text-scram-titanium"
                }`}
              >
                <div className="font-bold text-xs text-scram-stark">Classic Direct</div>
                <div className="text-[9px] text-scram-titanium mt-1">Direct transfer (Fastest)</div>
              </button>
            </div>

            {/* Settings */}
            <div className="p-3 bg-scram-card border border-scram-border rounded space-y-3">
              {fundingMode === "CEX_API_DIRECT" && (
                <div>
                  <label className="text-[10px] text-scram-titanium block mb-1">Exchange Provider</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["OKX", "BINANCE", "BYBIT"] as const).map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setSelectedExchange(ex)}
                        className={`py-1.5 rounded border text-center ${
                          selectedExchange === ex
                            ? "border-scram-plasma bg-scram-plasma/20 text-scram-stark font-bold"
                            : "border-scram-border text-scram-titanium bg-scram-void"
                        }`}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-scram-titanium">Randomized Deviation Jitter</span>
                    <span className="text-scram-plasma font-bold">±{randomDeviation}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={randomDeviation}
                    onChange={(e) => setRandomDeviation(Number(e.target.value))}
                    className="w-full accent-scram-plasma"
                  />
                  <div className="text-[9px] text-scram-titanium mt-0.5">
                    Avoids predictable round balances (e.g. 1.83 SOL vs 2.0 SOL)
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-scram-titanium">Funding Time Spacing</span>
                    <span className="text-scram-plasma font-bold">{fundingGapMin} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={fundingGapMin}
                    onChange={(e) => setFundingGapMin(Number(e.target.value))}
                    className="w-full accent-scram-plasma"
                  />
                  <div className="text-[9px] text-scram-titanium mt-0.5">
                    Separates block timestamps on BubbleMaps
                  </div>
                </div>
              </div>
            </div>

            {/* Micro-Funding Threshold */}
            <div className="p-3 bg-scram-card border border-scram-border rounded flex justify-between items-center">
              <div>
                <div className="text-scram-stark font-semibold text-xs">
                  SCRAMJET Micro-Subwallet Threshold
                </div>
                <div className="text-[9px] text-scram-titanium">
                  Allows funding wallets with as little as 0.01 SOL (vs Proxima 0.10 SOL lockup)
                </div>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-sm">0.010 SOL</span>
                <div className="text-[9px] text-scram-titanium">+0.001 SOL fee</div>
              </div>
            </div>

            <button
              onClick={() => alert(`Executed Ghost Funder Dispersal via ${fundingMode}!`)}
              className="w-full bg-scram-plasma hover:bg-scram-flare text-black font-bold py-3 rounded uppercase tracking-wider text-xs shadow-plasma transition-all"
            >
              Disperse Funds Across Wallets →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
