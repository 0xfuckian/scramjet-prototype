"use client";

import React, { useState, useEffect } from "react";
import {
  SubWallet,
  MultiWalletTradeConfig,
  MultiWalletBuyOrderType,
  WalletSelectionStrategy,
  AmountDistributionStrategy,
} from "../../types";

export default function WorkspacePage() {
  const [currentSlot, setCurrentSlot] = useState(318942150);
  const [top10Percent, setTop10Percent] = useState(12.4); // Turns red at >= 15%
  const [marketCapUsd, setMarketCapUsd] = useState(84250);
  const [volumeSol, setVolumeSol] = useState(312.5);

  // Instant Trade Panel Hotkey State
  const [isArmed, setIsArmed] = useState(false);
  const [tradeMode, setTradeMode] = useState<"BUY" | "SELL">("BUY");
  const [quickAmountSol, setQuickAmountSol] = useState(0.5);
  const [orderType, setOrderType] = useState<MultiWalletBuyOrderType>("PARALLEL");
  const [selectionStrategy, setSelectionStrategy] = useState<WalletSelectionStrategy>("ALL");
  const [amountDistribution, setAmountDistribution] = useState<AmountDistributionStrategy>("EQUAL");
  const [staggerDelay, setStaggerDelay] = useState(2);

  // AMM Automations
  const [bumpBotActive, setBumpBotActive] = useState(false);
  const [bumpIntervalSec, setBumpIntervalSec] = useState(15);
  const [greenTwapActive, setGreenTwapActive] = useState(false);
  const [twapSlicePercent, setTwapSlicePercent] = useState(10);

  // Post-Launch Token Actions
  const [burnPercent, setBurnPercent] = useState(5);
  const [lockPercent, setLockPercent] = useState(25);
  const [lockDurationDays, setLockDurationDays] = useState(90);

  // Simulated Sub-Wallets
  const [wallets] = useState<SubWallet[]>([
    {
      id: "w-1",
      publicKey: "9xQeW...kP8a",
      role: "DEPLOYER",
      balanceSol: 4.82,
      tokenBalance: 150000000,
      allocatedBuySol: 2.5,
      buyDelaySeconds: 0,
      status: "EXECUTED",
    },
    {
      id: "w-2",
      publicKey: "3mK2f...7tL9",
      role: "FRONT_MEV",
      balanceSol: 0.85,
      tokenBalance: 42000000,
      allocatedBuySol: 1.0,
      buyDelaySeconds: 0,
      status: "EXECUTED",
    },
    {
      id: "w-3",
      publicKey: "7hV9b...1xR4",
      role: "FRONT_MEV",
      balanceSol: 0.92,
      tokenBalance: 39000000,
      allocatedBuySol: 1.0,
      buyDelaySeconds: 0,
      status: "EXECUTED",
    },
    {
      id: "w-4",
      publicKey: "5tP4n...9qY2",
      role: "BACK_MEV",
      balanceSol: 0.44,
      tokenBalance: 21000000,
      allocatedBuySol: 0.5,
      buyDelaySeconds: 2,
      status: "EXECUTED",
    },
    {
      id: "w-5",
      publicKey: "8wR6m...3zC1",
      role: "FINAL_HOLDER",
      balanceSol: 0.12,
      tokenBalance: 12500000,
      allocatedBuySol: 0.25,
      buyDelaySeconds: 5,
      status: "EXECUTED",
    },
  ]);

  // Space-bar hotkey arming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setIsArmed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Slot ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlot((s) => s + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 font-mono text-xs">
      {/* Telemetry Header */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-scram-surface border border-scram-border p-4 rounded">
        <div>
          <div className="text-[10px] text-scram-titanium uppercase">Market Cap</div>
          <div className="text-base font-bold text-scram-stark">
            ${marketCapUsd.toLocaleString()}
          </div>
          <div className="text-[9px] text-emerald-400 font-mono">BONDING CURVE 68%</div>
        </div>
        <div>
          <div className="text-[10px] text-scram-titanium uppercase">Current Slot</div>
          <div className="text-base font-bold text-scram-plasma">{currentSlot}</div>
          <div className="text-[9px] text-scram-titanium">~400ms BLOCK TIME</div>
        </div>
        <div>
          <div className="text-[10px] text-scram-titanium uppercase">24H Volume</div>
          <div className="text-base font-bold text-scram-stark">{volumeSol} SOL</div>
          <div className="text-[9px] text-scram-titanium">~$29,328 USD</div>
        </div>
        <div>
          <div className="text-[10px] text-scram-titanium uppercase">Top 10 Holders</div>
          <div
            className={`text-base font-bold ${
              top10Percent >= 15 ? "text-red-500 animate-pulse" : "text-emerald-400"
            }`}
          >
            {top10Percent}%
          </div>
          <div className="text-[9px] text-scram-titanium">
            {top10Percent >= 15 ? "ALERT: CLUSTERING RISK" : "CLEAN DISTRIBUTION"}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-scram-titanium uppercase">Mach Velocity</div>
          <div className="text-base font-bold text-scram-plasma">MACH 4.2</div>
          <div className="text-[9px] text-emerald-400">HYPERSONIC CASCADE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Floating Instant Trade HUD */}
        <div className="lg:col-span-1 space-y-4">
          <div
            className={`bg-scram-card border p-4 rounded space-y-4 transition-all ${
              isArmed
                ? "border-scram-plasma shadow-plasma bg-scram-plasma/5"
                : "border-scram-border"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-scram-stark uppercase text-xs flex items-center space-x-2">
                <span>Instant Trade HUD</span>
                {isArmed && (
                  <span className="text-[9px] bg-scram-plasma text-black font-bold px-1.5 py-0.5 rounded">
                    ARMED
                  </span>
                )}
              </span>
              <button
                onClick={() => setIsArmed(!isArmed)}
                className="text-[10px] px-2 py-1 rounded bg-scram-void border border-scram-border hover:border-scram-plasma text-scram-titanium"
              >
                Hold [SPACE] to Arm
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTradeMode("BUY")}
                className={`py-2 rounded font-bold text-center ${
                  tradeMode === "BUY"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-scram-void text-scram-titanium border border-scram-border"
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => setTradeMode("SELL")}
                className={`py-2 rounded font-bold text-center ${
                  tradeMode === "SELL"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-scram-void text-scram-titanium border border-scram-border"
                }`}
              >
                SELL
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-scram-titanium block">Execution Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderType("PARALLEL")}
                  className={`py-1.5 rounded text-center border text-[11px] ${
                    orderType === "PARALLEL"
                      ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark"
                      : "border-scram-border text-scram-titanium bg-scram-void"
                  }`}
                >
                  Parallel (Atomic)
                </button>
                <button
                  onClick={() => setOrderType("STAGGER")}
                  className={`py-1.5 rounded text-center border text-[11px] ${
                    orderType === "STAGGER"
                      ? "border-scram-plasma bg-scram-plasma/10 text-scram-stark"
                      : "border-scram-border text-scram-titanium bg-scram-void"
                  }`}
                >
                  Stagger ({staggerDelay}s)
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-scram-titanium block">Quick Presets (SOL)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0.1, 0.5, 1.0, 2.0].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setQuickAmountSol(amt)}
                    className={`py-1 rounded text-center border text-[10px] ${
                      quickAmountSol === amt
                        ? "border-scram-plasma bg-scram-plasma text-black font-bold"
                        : "border-scram-border text-scram-titanium bg-scram-void"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  `Dispatched ${tradeMode} order of ${quickAmountSol} SOL across sub-wallets (${orderType})`
                )
              }
              className={`w-full py-2.5 rounded font-bold uppercase tracking-wider text-xs shadow-plasma transition-all ${
                tradeMode === "BUY"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                  : "bg-red-500 hover:bg-red-400 text-white"
              }`}
            >
              Execute Multi-Wallet {tradeMode}
            </button>
          </div>

          {/* AMM Automations Panel */}
          <div className="bg-scram-surface border border-scram-border p-4 rounded space-y-3">
            <div className="font-bold text-scram-stark uppercase text-xs">
              Algorithmic Market Maker
            </div>

            <div className="p-2.5 bg-scram-card border border-scram-border rounded flex justify-between items-center">
              <div>
                <div className="text-scram-stark font-semibold">Photon Bump Bot</div>
                <div className="text-[9px] text-scram-titanium">
                  Micro-buys every {bumpIntervalSec}s
                </div>
              </div>
              <input
                type="checkbox"
                checked={bumpBotActive}
                onChange={(e) => setBumpBotActive(e.target.checked)}
                className="accent-scram-plasma"
              />
            </div>

            <div className="p-2.5 bg-scram-card border border-scram-border rounded flex justify-between items-center">
              <div>
                <div className="text-scram-stark font-semibold">Green-Candle TWAP</div>
                <div className="text-[9px] text-scram-titanium">
                  Liquidates {twapSlicePercent}% on green bars only
                </div>
              </div>
              <input
                type="checkbox"
                checked={greenTwapActive}
                onChange={(e) => setGreenTwapActive(e.target.checked)}
                className="accent-scram-plasma"
              />
            </div>
          </div>
        </div>

        {/* Right Columns: Sub-Wallets Table & Post-Launch Ops */}
        <div className="lg:col-span-2 space-y-4">
          {/* Post-Launch Operations Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-scram-surface border border-scram-border p-4 rounded">
            {/* Streamflow Lock */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-scram-stark text-xs">Streamflow Supply Lock</span>
                <span className="text-scram-plasma font-bold">{lockPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={lockPercent}
                onChange={(e) => setLockPercent(Number(e.target.value))}
                className="w-full accent-scram-plasma"
              />
              <button
                onClick={() => alert(`Locked ${lockPercent}% supply for ${lockDurationDays} days via Streamflow!`)}
                className="w-full py-1.5 rounded bg-scram-void border border-scram-border hover:border-scram-plasma text-scram-stark text-[11px]"
              >
                Lock via Streamflow ({lockDurationDays}d)
              </button>
            </div>

            {/* Dev Supply Burn */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-scram-stark text-xs">Dev Supply Burn</span>
                <span className="text-red-400 font-bold">{burnPercent}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={burnPercent}
                onChange={(e) => setBurnPercent(Number(e.target.value))}
                className="w-full accent-red-500"
              />
              <button
                onClick={() => alert(`Burned ${burnPercent}% of dev wallet token balance!`)}
                className="w-full py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-[11px] font-bold"
              >
                Burn Token Supply
              </button>
            </div>
          </div>

          {/* Sub-Wallets Management Table */}
          <div className="bg-scram-surface border border-scram-border p-4 rounded space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
                Active Sub-Wallets (Cohort 1)
              </span>
              <span className="text-[10px] text-scram-titanium">5 Wallets Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-scram-border text-[10px] text-scram-titanium">
                    <th className="py-2 px-2">Role</th>
                    <th className="py-2 px-2">Public Key</th>
                    <th className="py-2 px-2">SOL Balance</th>
                    <th className="py-2 px-2">Tokens</th>
                    <th className="py-2 px-2">Delay</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-scram-border/50 hover:bg-scram-card/50 text-[11px]"
                    >
                      <td className="py-2.5 px-2 font-semibold text-scram-plasma">{w.role}</td>
                      <td className="py-2.5 px-2 font-mono text-scram-stark">{w.publicKey}</td>
                      <td className="py-2.5 px-2 font-bold">{w.balanceSol.toFixed(2)} SOL</td>
                      <td className="py-2.5 px-2 text-scram-titanium">
                        {(w.tokenBalance / 1e6).toFixed(1)}M
                      </td>
                      <td className="py-2.5 px-2 text-scram-titanium">{w.buyDelaySeconds}s</td>
                      <td className="py-2.5 px-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
