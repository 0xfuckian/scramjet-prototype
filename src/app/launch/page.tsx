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
  const [activeTab, setActiveTab] = useState<"chain" | "token" | "settings">("chain");
  const [selectedChain, setSelectedChain] = useState<"solana" | "bsc" | "base" | "eth">("solana");
  const [launchpad, setLaunchpad] = useState<SolanaLaunchpad>("PUMP_FUN");

  // Token Details
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");

  // Launchpad-specific settings
  const [offChainCreate, setOffChainCreate] = useState(true);
  const [mayhemMode, setMayhemMode] = useState(false);
  const [zaioSplit, setZaioSplit] = useState(false);
  const [meteoraConfigKey, setMeteoraConfigKey] = useState("Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB");
  const [dynamicFeeBps, setDynamicFeeBps] = useState(250); // 2.5%
  const [autoReinvestDlmm, setAutoReinvestDlmm] = useState(true);
  const [raydiumPlatformConfig, setRaydiumPlatformConfig] = useState("");
  const [raydiumCustomRaise, setRaydiumCustomRaise] = useState(85);

  // Launch Mode & Block-0 Settings (1:1 Proxima screenshot)
  const [launchMode, setLaunchMode] = useState<"BLOCK_0" | "ORGANIC" | "MANUAL">("BLOCK_0");
  const [preset, setPreset] = useState<BuildPreset>("CLEAN_BUILD");
  const [devBuyPercent, setDevBuyPercent] = useState<number>(0);
  const [holdersBuyPercent, setHoldersBuyPercent] = useState<number>(0);
  const [holderCount, setHolderCount] = useState<number>(24);
  const [backMevTuning, setBackMevTuning] = useState<number>(40);
  const [jitoTipSol, setJitoTipSol] = useState<number>(0.015);

  // Sniper Guard
  const [sniperGuardEnabled, setSniperGuardEnabled] = useState(true);
  const [sniperTriggerSol, setSniperTriggerSol] = useState(5.0);
  const [sniperAction, setSniperAction] = useState<SniperGuardAction>("NUKE");
  const [nukeScope, setNukeScope] = useState<NukeWalletScope>("HOLDERS_ONLY");

  // Fee Strategy
  const [creatorSolPercent, setCreatorSolPercent] = useState(50);
  const [buybackBurnPercent, setBuybackBurnPercent] = useState(50);

  // Chains array
  const chains = [
    { id: "solana", name: "Solana", count: "12 LAUNCHPADS", active: true },
    { id: "bsc", name: "BNB Smart Chain", count: "6 LAUNCHPADS", active: false },
    { id: "base", name: "Base", count: "5 LAUNCHPADS", active: false },
    { id: "eth", name: "Ethereum", count: "2 LAUNCHPADS", active: false },
  ];

  // 12 Launchpads with realistic custom brand SVGs / Logos
  const launchpadList: { id: SolanaLaunchpad; name: string; tag: string; icon: React.ReactNode }[] = [
    {
      id: "PUMP_FUN",
      name: "PumpFun",
      tag: "SOL · USDC",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="12" fill="#10B981" />
          <path d="M7 14.5L12 9.5L17 14.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "METEORA_DBC",
      name: "Meteora DBC",
      tag: "SOL · USDC",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#EF4444" />
          <path d="M12 6L14 11H19L15 14L16.5 19L12 16L7.5 19L9 14L5 11H10L12 6Z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "RAYDIUM_LAUNCHLAB",
      name: "Raydium LaunchLab",
      tag: "SOL · USD1",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#3B82F6" />
          <polygon points="12 4 19 8 19 16 12 20 5 16 5 8" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: "STONK_FUN",
      name: "StonkFun",
      tag: "SOL · USDC",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#0284C7" />
          <path d="M6 16L11 11L14 14L18 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "LETS_BONK",
      name: "LetsBonk",
      tag: "SOL · USD1",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#F97316" />
          <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "BAGS",
      name: "Bags",
      tag: "SOL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#10B981" />
          <rect x="8" y="9" width="8" height="9" rx="2" fill="#FFFFFF" />
          <path d="M10 9V7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7V9" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "PRINTR",
      name: "Printr",
      tag: "SOL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#8B5CF6" />
          <rect x="6" y="8" width="12" height="8" rx="1" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "ANONCOIN",
      name: "Anoncoin",
      tag: "SOL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#374151" />
          <circle cx="9" cy="11" r="1.5" fill="#FFFFFF" />
          <circle cx="15" cy="11" r="1.5" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "SURGE",
      name: "Surge",
      tag: "SOL · USD1",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#06B6D4" />
          <path d="M13 3L6 14H12L11 21L18 10H12L13 3Z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "STOXES",
      name: "Stoxes",
      tag: "SOL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#EC4899" />
          <rect x="7" y="11" width="3" height="7" fill="#FFFFFF" />
          <rect x="11" y="8" width="3" height="10" fill="#FFFFFF" />
          <rect x="15" y="5" width="3" height="13" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "LESGO",
      name: "Lesgo",
      tag: "SOL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#EAB308" />
          <path d="M9 7L16 12L9 17V7Z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "MEME_FUN",
      name: "meme.fun",
      tag: "SOL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#F43F5E" />
          <path d="M8 14C8.5 15.5 10 16.5 12 16.5C14 16.5 15.5 15.5 16 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] font-sans">
      {/* 1:1 Subheader Tab Strip (CHAIN & LAUNCHPAD | TOKEN DETAILS | LAUNCH SETTINGS) */}
      <div className="h-[44px] border-b border-[#1C2533] bg-[#0D1117] px-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-8 font-medium">
          <button
            onClick={() => setActiveTab("chain")}
            className={`h-[44px] border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "chain"
                ? "border-[#FF3E00] text-[#F8FAFC] font-semibold"
                : "border-transparent text-[#8E9AA8] hover:text-[#F8FAFC]"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#1C2533] flex items-center justify-center text-[10px]">1</span>
            <span>CHAIN &amp; LAUNCHPAD</span>
          </button>

          <button
            onClick={() => setActiveTab("token")}
            className={`h-[44px] border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "token"
                ? "border-[#FF3E00] text-[#F8FAFC] font-semibold"
                : "border-transparent text-[#8E9AA8] hover:text-[#F8FAFC]"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#1C2533] flex items-center justify-center text-[10px]">2</span>
            <span>TOKEN DETAILS</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`h-[44px] border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "settings"
                ? "border-[#FF3E00] text-[#F8FAFC] font-semibold"
                : "border-transparent text-[#8E9AA8] hover:text-[#F8FAFC]"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#1C2533] flex items-center justify-center text-[10px]">3</span>
            <span>LAUNCH SETTINGS</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#8E9AA8]">
          STATUS: <span className="text-[#31E3AC]">CONFIGURATION READY</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ================= TAB 1: CHAIN & LAUNCHPAD ================= */}
        {activeTab === "chain" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Blockchain Selection */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9AA8] font-semibold">
                BLOCKCHAIN
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {chains.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChain(c.id as any)}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      selectedChain === c.id
                        ? "border-[#FF3E00] bg-[#FF3E00]/10 shadow-[0_0_15px_rgba(255,62,0,0.2)]"
                        : "border-[#1C2533] bg-[#0D1117] hover:border-[#2D3748]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {c.id === "solana" ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M4 17.5L7.5 21H20L16.5 17.5H4Z" fill="#31E3AC" />
                          <path d="M4 10.5L7.5 14H20L16.5 10.5H4Z" fill="#38BDF8" />
                          <path d="M4 3.5L7.5 7H20L16.5 3.5H4Z" fill="#818CF8" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#1C2533]" />
                      )}
                      <span className="font-bold text-xs text-[#F8FAFC]">{c.name}</span>
                    </div>
                    <div className="text-[9px] font-mono text-[#8E9AA8]">{c.count}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Launchpad Selection (With Real SVG Logos) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9AA8] font-semibold">
                  LAUNCHPAD
                </span>
                <span className="text-[10px] font-mono text-[#FF3E00]">3.5% Platform Fee</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {launchpadList.map((lp) => (
                  <button
                    key={lp.id}
                    onClick={() => setLaunchpad(lp.id)}
                    className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
                      launchpad === lp.id
                        ? "border-[#FF3E00] bg-[#121721] shadow-[0_0_15px_rgba(255,62,0,0.25)]"
                        : "border-[#1C2533] bg-[#0D1117] hover:border-[#2D3748] hover:bg-[#121721]"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">{lp.icon}</div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#F8FAFC] truncate">{lp.name}</div>
                      <div className="text-[9px] font-mono text-[#8E9AA8] mt-0.5">{lp.tag}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Launchpad Specific Options (PumpFun & Meteora DBC) */}
            {launchpad === "PUMP_FUN" && (
              <div className="p-4 rounded-xl border border-[#1C2533] bg-[#0D1117] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1C2533] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span className="font-bold text-xs text-[#F8FAFC]">PumpFun Specific Settings</span>
                  </div>
                  <span className="text-[10px] text-[#8E9AA8] font-mono">REWARDS &amp; OPTIONS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="p-3 rounded-lg border border-[#1C2533] bg-[#08090C] flex items-center justify-between cursor-pointer hover:border-[#2D3748]">
                    <div>
                      <div className="font-semibold text-xs text-[#F8FAFC]">Off-Chain Create</div>
                      <div className="text-[10px] text-[#8E9AA8]">Mask dev as on-chain creator with random pubkey</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={offChainCreate}
                      onChange={(e) => setOffChainCreate(e.target.checked)}
                      className="accent-[#FF3E00] w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="p-3 rounded-lg border border-[#1C2533] bg-[#08090C] flex items-center justify-between cursor-pointer hover:border-[#2D3748]">
                    <div>
                      <div className="font-semibold text-xs text-[#F8FAFC]">Mayhem Mode</div>
                      <div className="text-[10px] text-[#8E9AA8]">Runs PumpFun AI trading bot for first 24h</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={mayhemMode}
                      onChange={(e) => setMayhemMode(e.target.checked)}
                      className="accent-[#FF3E00] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {launchpad === "METEORA_DBC" && (
              <div className="p-4 rounded-xl border border-[#1C2533] bg-[#0D1117] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1C2533] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="font-bold text-xs text-[#F8FAFC]">Meteora Dynamic Curve (DBC)</span>
                  </div>
                  <span className="text-[10px] text-[#8E9AA8] font-mono">DLMM TRANSITION</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">Configuration Key</label>
                    <input
                      type="text"
                      value={meteoraConfigKey}
                      onChange={(e) => setMeteoraConfigKey(e.target.value)}
                      className="w-full h-9 bg-[#08090C] border border-[#1C2533] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">
                      Dynamic Fee: {(dynamicFeeBps / 100).toFixed(2)}% ({dynamicFeeBps} bps)
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="500"
                      value={dynamicFeeBps}
                      onChange={(e) => setDynamicFeeBps(Number(e.target.value))}
                      className="w-full mt-2 accent-[#FF3E00]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-[#1C2533]">
              <button
                onClick={() => setActiveTab("token")}
                className="px-6 py-2.5 rounded-lg bg-[#FF3E00] hover:bg-[#FF5500] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,62,0,0.3)]"
              >
                Next: Token Details →
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TOKEN DETAILS ================= */}
        {activeTab === "token" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-xl border border-[#1C2533] bg-[#0D1117] space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9AA8] font-semibold">
                TOKEN IDENTITY
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">Token Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. SCRAMJET"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full h-10 bg-[#08090C] border border-[#1C2533] focus:border-[#FF3E00] rounded px-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">Ticker Symbol *</label>
                  <input
                    type="text"
                    placeholder="e.g. SCRAM"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="w-full h-10 bg-[#08090C] border border-[#1C2533] focus:border-[#FF3E00] rounded px-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Tell traders about your token and roadmap..."
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    className="w-full bg-[#08090C] border border-[#1C2533] focus:border-[#FF3E00] rounded p-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#1C2533] bg-[#0D1117] space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9AA8] font-semibold">
                SOCIAL LINKS (OPTIONAL)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Website URL"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="h-10 bg-[#08090C] border border-[#1C2533] rounded px-3 text-xs text-[#F8FAFC] outline-none"
                />
                <input
                  type="text"
                  placeholder="Twitter / X"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="h-10 bg-[#08090C] border border-[#1C2533] rounded px-3 text-xs text-[#F8FAFC] outline-none"
                />
                <input
                  type="text"
                  placeholder="Telegram"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="h-10 bg-[#08090C] border border-[#1C2533] rounded px-3 text-xs text-[#F8FAFC] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#1C2533]">
              <button
                onClick={() => setActiveTab("chain")}
                className="px-6 py-2 rounded border border-[#1C2533] text-xs text-[#8E9AA8] hover:text-[#F8FAFC]"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className="px-6 py-2.5 rounded-lg bg-[#FF3E00] hover:bg-[#FF5500] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,62,0,0.3)]"
              >
                Next: Launch Settings →
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LAUNCH SETTINGS (1:1 PROXIMA CARDS) ================= */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fadeIn">
            {/* 3 Large Launch Mode Cards (1:1 Proxima screenshot 04) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9AA8] font-semibold">
                  CHOOSE LAUNCH MODE
                </span>
                <span className="text-[10px] font-mono text-[#31E3AC]">BLOCK-0 JITO INTEGRATION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Block-0 Card */}
                <button
                  onClick={() => setLaunchMode("BLOCK_0")}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    launchMode === "BLOCK_0"
                      ? "border-[#FF3E00] bg-[#121721] text-[#F8FAFC] shadow-[0_0_18px_rgba(255,62,0,0.25)]"
                      : "border-[#1C2533] bg-[#0D1117] text-[#8E9AA8] hover:border-[#2D3748]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FF3E00]/20 flex items-center justify-center text-[#FF3E00]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="font-bold text-sm text-[#F8FAFC]">Block-0 Mode</div>
                  <div className="text-[10px] text-[#8E9AA8]">Atomic multi-wallet MEV bundle</div>
                </button>

                {/* Organic Mode Card */}
                <button
                  onClick={() => setLaunchMode("ORGANIC")}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    launchMode === "ORGANIC"
                      ? "border-[#FF3E00] bg-[#121721] text-[#F8FAFC] shadow-[0_0_18px_rgba(255,62,0,0.25)]"
                      : "border-[#1C2533] bg-[#0D1117] text-[#8E9AA8] hover:border-[#2D3748]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#31E3AC]/20 flex items-center justify-center text-[#31E3AC]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="font-bold text-sm text-[#F8FAFC]">Organic Mode</div>
                  <div className="text-[10px] text-[#8E9AA8]">Sequential buys with buy delay</div>
                </button>

                {/* Manual Mode Card */}
                <button
                  onClick={() => setLaunchMode("MANUAL")}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    launchMode === "MANUAL"
                      ? "border-[#FF3E00] bg-[#121721] text-[#F8FAFC] shadow-[0_0_18px_rgba(255,62,0,0.25)]"
                      : "border-[#1C2533] bg-[#0D1117] text-[#8E9AA8] hover:border-[#2D3748]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15" />
                    </svg>
                  </div>
                  <div className="font-bold text-sm text-[#F8FAFC]">Manual Mode</div>
                  <div className="text-[10px] text-[#8E9AA8]">Submit orders yourself in HUD</div>
                </button>
              </div>
            </div>

            {/* Presets and Percent Inputs (1:1 Proxima screenshot 04) */}
            <div className="p-5 rounded-xl border border-[#1C2533] bg-[#0D1117] space-y-4">
              <div className="flex justify-between items-center border-b border-[#1C2533] pb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9AA8] font-semibold">
                  ALLOCATION &amp; PRESET
                </span>
                <div className="flex gap-1.5 font-mono text-[10px]">
                  {(["QUICK_BUILD", "CLEAN_BUILD", "FULL_BUILD"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPreset(p)}
                      className={`px-2.5 py-1 rounded border ${
                        preset === p
                          ? "border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00] font-bold"
                          : "border-[#1C2533] text-[#8E9AA8] bg-[#08090C]"
                      }`}
                    >
                      {p.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Developer Buy % & Holders Buy % inputs from Proxima */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-[#1C2533] bg-[#08090C] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8E9AA8]">Developer Buy % (optional)</span>
                    <span className="font-mono text-[#F8FAFC] font-bold">{devBuyPercent}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={devBuyPercent}
                      onChange={(e) => setDevBuyPercent(Number(e.target.value))}
                      className="w-full h-10 bg-[#0D1117] border border-[#1C2533] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#8E9AA8] font-mono">%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-[#1C2533] bg-[#08090C] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8E9AA8]">Holders Buy * (Excluding Developer)</span>
                    <span className="font-mono text-[#F8FAFC] font-bold">{holdersBuyPercent}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={holdersBuyPercent}
                      onChange={(e) => setHoldersBuyPercent(Number(e.target.value))}
                      className="w-full h-10 bg-[#0D1117] border border-[#1C2533] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#8E9AA8] font-mono">%</span>
                  </div>
                </div>
              </div>

              {/* Back MEV Tuning Slider */}
              <div className="p-3.5 rounded-lg border border-[#1C2533] bg-[#08090C] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8E9AA8]">Back MEV Tuning Slider</span>
                  <span className="text-[#FF3E00] font-mono font-bold">
                    {backMevTuning < 50 ? "Less Sniper Markers" : "Less Top-Trader Visibility"} ({backMevTuning}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={backMevTuning}
                  onChange={(e) => setBackMevTuning(Number(e.target.value))}
                  className="w-full accent-[#FF3E00]"
                />
                <div className="flex justify-between text-[10px] text-[#8E9AA8] font-mono">
                  <span>← Fewer sniper-sell markers</span>
                  <span>Less top-trader visibility →</span>
                </div>
              </div>

              {/* Jito Tip & Sub-Wallet Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">Holder Wallet Count</label>
                  <input
                    type="number"
                    value={holderCount}
                    onChange={(e) => setHolderCount(Number(e.target.value))}
                    className="w-full h-10 bg-[#08090C] border border-[#1C2533] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">Jito Block-0 Bribe (SOL)</label>
                  <input
                    type="number"
                    step="0.005"
                    value={jitoTipSol}
                    onChange={(e) => setJitoTipSol(Number(e.target.value))}
                    className="w-full h-10 bg-[#08090C] border border-[#1C2533] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                  />
                </div>
              </div>
            </div>

            {/* Sniper Guard & Creator Fee Strategy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#1C2533] bg-[#0D1117] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#F8FAFC]">Sniper Guard Defense</span>
                  <input
                    type="checkbox"
                    checked={sniperGuardEnabled}
                    onChange={(e) => setSniperGuardEnabled(e.target.checked)}
                    className="accent-[#FF3E00] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] text-[#8E9AA8]">
                  Auto-nukes if external snipers buy over {sniperTriggerSol} SOL in Block-0.
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSniperAction("NUKE")}
                    className={`py-2 rounded text-xs font-bold border ${
                      sniperAction === "NUKE"
                        ? "border-[#FF2A55] bg-[#FF2A55]/10 text-[#FF2A55]"
                        : "border-[#1C2533] text-[#8E9AA8]"
                    }`}
                  >
                    Nuke Wallets
                  </button>
                  <button
                    onClick={() => setSniperAction("COMPLETE_EARLY")}
                    className={`py-2 rounded text-xs font-bold border ${
                      sniperAction === "COMPLETE_EARLY"
                        ? "border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]"
                        : "border-[#1C2533] text-[#8E9AA8]"
                    }`}
                  >
                    Complete Early
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#1C2533] bg-[#0D1117] space-y-3">
                <span className="font-bold text-xs text-[#F8FAFC] block">Creator Fee Buyback Loop</span>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#8E9AA8]">Buyback &amp; Burn:</span>
                  <span className="text-[#FF3E00] font-bold">{buybackBurnPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={buybackBurnPercent}
                  onChange={(e) => setBuybackBurnPercent(Number(e.target.value))}
                  className="w-full accent-[#FF3E00]"
                />
                <div className="text-[10px] text-[#8E9AA8]">
                  Automatically routes claimed fees to market buy tokens on curve and burn SPL supply.
                </div>
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="flex justify-between items-center pt-4 border-t border-[#1C2533]">
              <button
                onClick={() => setActiveTab("token")}
                className="px-6 py-2 rounded border border-[#1C2533] text-xs text-[#8E9AA8] hover:text-[#F8FAFC]"
              >
                ← Back
              </button>
              <button
                onClick={() => alert(`Launching ${tokenSymbol || "Token"} on ${launchpad} via Block-0 bundle!`)}
                className="px-8 py-3 rounded-lg bg-[#FF3E00] hover:bg-[#FF5500] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,62,0,0.4)]"
              >
                Dispatch Block-0 Bundle →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

