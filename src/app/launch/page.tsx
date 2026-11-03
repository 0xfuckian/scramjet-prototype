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
import { calculateUpfrontLaunchFee, isExemptFromFees } from "../../lib/feeRouter";
import { useLaunchStore } from "../../lib/stores/useLaunchStore";
import { DEFAULT_PLATFORM_FEE_VAULT } from "../../lib/constants";
import { LaunchOrchestrator, LaunchOrchestrationResult } from "../../lib/pipeline/launchOrchestrator";
import { getSolanaConnection } from "../../lib/solana/connection";
import { PublicKey } from "@solana/web3.js";

export default function LaunchPage() {
  const [activeTab, setActiveTab] = useState<"chain" | "token" | "settings">("chain");
  const [selectedChain, setSelectedChain] = useState<"solana" | "bsc" | "base" | "eth">("solana");
  const [launchpad, setLaunchpad] = useState<SolanaLaunchpad>("PUMP_FUN");

  // Token Details (Screenshot 9)
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");

  // Currency & Creator Rewards Selection (Screenshots 2-8)
  const [currency, setCurrency] = useState<"SOL" | "USDC" | "USD1" | "CHIP" | "ORE" | "CUSTOM">("SOL");
  const [creatorRewardTarget, setCreatorRewardTarget] = useState<"CREATOR" | "HOLDERS">("CREATOR");

  // PumpFun Specific Options (Screenshot 2)
  const [pumpOtcDesks, setPumpOtcDesks] = useState(false);
  const [pumpUsePaid, setPumpUsePaid] = useState(false);
  const [pumpZaio, setPumpZaio] = useState(false);
  const [pumpAnsem, setPumpAnsem] = useState(false);
  const [pumpCreatorFeeDist, setPumpCreatorFeeDist] = useState(false);
  const [pumpAdvancedOpen, setPumpAdvancedOpen] = useState(false);

  // Meteora DBC Specific Options (Screenshot 3)
  const [meteoraDbcConfigKey, setMeteoraDbcConfigKey] = useState("");
  const [meteoraQuoteMint, setMeteoraQuoteMint] = useState("");

  // Raydium Specific Options (Screenshot 4)
  const [raydiumPlatformConfig, setRaydiumPlatformConfig] = useState("");

  // StonkFun Specific Options (Screenshot 5)
  const [stonkFeeModel, setStonkFeeModel] = useState<"Standard" | "Rewards">("Standard");

  // Bags Specific Options (Screenshot 7)
  const [bagsShareFees, setBagsShareFees] = useState(false);

  // Anoncoin Specific Options (Screenshot 8)
  const [anoncoinApiKey, setAnoncoinApiKey] = useState("");

  // Launch Mode & Block-0 Settings
  const [launchMode, setLaunchMode] = useState<"BLOCK_0" | "ORGANIC" | "MANUAL">("BLOCK_0");
  const [preset, setPreset] = useState<BuildPreset>("CLEAN_BUILD");
  const [devBuyPercent, setDevBuyPercent] = useState<number>(0);
  const [holdersBuyPercent, setHoldersBuyPercent] = useState<number>(0);
  const [holderCount, setHolderCount] = useState<number>(24);
  const [backMevTuning, setBackMevTuning] = useState<number>(40);
  const [jitoTipSol, setJitoTipSol] = useState<number>(0.015);

  const connectedWallet = useLaunchStore((state) => state.connectedWallet);
  const isExempt = isExemptFromFees(connectedWallet);

  // Dynamic Launch Fee (Base 0.15 SOL + 0.005 SOL per wallet; 0 for exempt admin wallets/emails)
  const upfrontFee = calculateUpfrontLaunchFee(holderCount, connectedWallet);

  // Sniper Guard
  const [sniperGuardEnabled, setSniperGuardEnabled] = useState(true);
  const [sniperTriggerSol, setSniperTriggerSol] = useState(5.0);
  const [sniperAction, setSniperAction] = useState<SniperGuardAction>("NUKE");
  const [nukeScope, setNukeScope] = useState<NukeWalletScope>("HOLDERS_ONLY");

  // Launch Dispatch State
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStep, setDispatchStep] = useState<string>("");
  const [dispatchResult, setDispatchResult] = useState<LaunchOrchestrationResult | null>(null);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  const handleDispatchBundle = async () => {
    try {
      setIsDispatching(true);
      setDispatchError(null);
      setDispatchStep("1/4 Generating sub-wallets via Turnkey enclave...");

      const connection = getSolanaConnection();
      if (!connectedWallet) {
        throw new Error("Please connect your Solana wallet first before dispatching a launch bundle.");
      }
      const masterPayer = connectedWallet;

      setDispatchStep("2/4 Planning Ghost Funder Merkle relay tree...");
      await new Promise((r) => setTimeout(r, 400));

      setDispatchStep("3/4 Assembling atomic Jito Block-0 bundle...");
      const result = await LaunchOrchestrator.executeLaunch({
        config: {
          tokenName: tokenName.trim() || "SCRAMJET",
          tokenSymbol: tokenSymbol.trim() || "SCRAM",
          tokenDescription: tokenDescription.trim() || "Hypersonic Solana Launch",
          imageUrl: imagePreview || "https://scramjet.tools/logo.png",
          network: "SOLANA",
          launchpad,
          launchMode: "BLOCK_0",
          block0Config: {
            preset,
            frontMevCount: 2,
            backMevCount: 4,
            backMevTuning,
            tempHolderCount: 0,
            holderCount,
            frontToBackDelayMs: 400,
            mevToTempDelayMs: 800,
            holderBuyDelaySeconds: 2,
            enableDynamicJitoTip: true,
            jitoTipPercentile: "P75",
            customJitoTipSol: jitoTipSol,
          },
          sniperGuard: {
            enabled: sniperGuardEnabled,
            triggerExternalBuySol: sniperTriggerSol,
            action: sniperAction,
            nukeScope,
          },
          ghostFunder: {
            fundingMode: "RELAY_MERKLE_TREE",
            fundingGapSeconds: 1800,
            randomDeviationPercent: 5,
          },
          marketMaker: {
            enableBumpBot: false,
            bumpIntervalSeconds: 15,
            bumpMinSol: 0.05,
            bumpMaxSol: 0.2,
            enableGreenCandleTwap: false,
            twapMaxSellPercentPerSlice: 10,
            targetTrendingBoard: "PHOTON",
          },
          feeStrategy: {
            harvestIntervalMinutes: 10,
            autoHarvest: true,
            feeAllocation: {
              creatorSolPercent: 50,
              buybackAndBurnPercent: 50,
              stablecoinSwapUsdcPercent: 0,
            },
          },
          devBuySol: devBuyPercent > 0 ? (devBuyPercent / 100) * 10 : 0,
          subWallets: [],
        },
        connection,
        masterPayer,
      });

      setDispatchStep("4/4 Dispatched to 5 regional Jito block engines!");
      setDispatchResult(result);
    } catch (err: any) {
      console.error("Launch dispatch error:", err);
      setDispatchError(err.message || "Failed to dispatch launch bundle");
    } finally {
      setIsDispatching(false);
    }
  };

  // Chains array (Solana active, others darkened with COMING SOON)
  const chains = [
    {
      id: "solana",
      name: "Solana",
      badge: "12 LAUNCHPADS",
      badgeColor: "bg-[#103833] text-[#31E3AC] border-[#1C5449]",
      icon: "/icons/chains/sol.webp",
      subIcons: ["/icons/dex/pumpfun.webp", "/icons/dex/raydium.webp"],
      isAvailable: true,
    },
    {
      id: "robinhood",
      name: "Robinhood",
      badge: "COMING SOON",
      badgeColor: "bg-[#14151C] text-[#636879] border-[#1C1E28]",
      icon: "/icons/chains/robinhood.webp",
      subIcons: ["/icons/dex/pangea.webp"],
      isAvailable: false,
    },
    {
      id: "bsc",
      name: "BNB Smart Chain",
      badge: "COMING SOON",
      badgeColor: "bg-[#14151C] text-[#636879] border-[#1C1E28]",
      icon: "/icons/chains/bsc.webp",
      subIcons: ["/icons/dex/fourmeme.webp"],
      isAvailable: false,
    },
    {
      id: "arc",
      name: "Arc",
      badge: "COMING SOON",
      tag: "NEW",
      badgeColor: "bg-[#14151C] text-[#636879] border-[#1C1E28]",
      icon: "/icons/chains/arc.webp",
      subIcons: ["/icons/dex/pangea.webp"],
      isAvailable: false,
    },
    {
      id: "eth",
      name: "Ethereum",
      badge: "COMING SOON",
      badgeColor: "bg-[#14151C] text-[#636879] border-[#1C1E28]",
      icon: "/icons/chains/eth.webp",
      subIcons: ["/icons/dex/flap.webp"],
      isAvailable: false,
    },
    {
      id: "base",
      name: "Base",
      badge: "COMING SOON",
      badgeColor: "bg-[#14151C] text-[#636879] border-[#1C1E28]",
      icon: "/icons/chains/base.webp",
      subIcons: ["/icons/dex/clanker.webp"],
      isAvailable: false,
    },
    {
      id: "xlayer",
      name: "X Layer",
      badge: "COMING SOON",
      badgeColor: "bg-[#14151C] text-[#636879] border-[#1C1E28]",
      icon: "/icons/chains/xlayer.webp",
      subIcons: [],
      isAvailable: false,
    },
  ];

  // Official 12 Launchpads with WebP Logos
  const launchpadList: { id: SolanaLaunchpad; name: string; icon: string }[] = [
    { id: "PUMP_FUN", name: "PumpFun", icon: "/icons/dex/pumpfun.webp" },
    { id: "METEORA_DBC", name: "Meteora DBC", icon: "/icons/dex/meteoradbc.webp" },
    { id: "RAYDIUM_LAUNCHLAB", name: "Raydium LaunchLab", icon: "/icons/dex/raydium.webp" },
    { id: "STONK_FUN", name: "StonkFun", icon: "/icons/dex/stonkfun.webp" },
    { id: "LETS_BONK", name: "LetsBonk", icon: "/icons/dex/bonkfun.webp" },
    { id: "BAGS", name: "Bags", icon: "/icons/dex/bags.webp" },
    { id: "ANONCOIN", name: "Anoncoin", icon: "/icons/dex/anoncoin.webp" },
    { id: "SURGE", name: "Surge", icon: "/icons/dex/surge.webp" },
    { id: "PRINTR", name: "Printr", icon: "/icons/dex/printr.webp" },
    { id: "STOXES", name: "Stoxes", icon: "/icons/dex/stoxes.webp" },
    { id: "MEME_FUN", name: "meme.fun", icon: "/icons/dex/memefun.webp" },
    { id: "LESGO", name: "Pangea", icon: "/icons/dex/pangea.webp" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <div className="min-h-full bg-[#08090C] text-[#F8FAFC] font-sans pb-16">
      {/* 1:1 Subheader Centered Pill Breadcrumbs (Screenshot 1 & 9) */}
      <div className="h-[48px] border-b border-[#1A1C25] bg-[#0A0B0E] px-6 flex items-center justify-center text-xs sticky top-0 z-10">
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <button
            onClick={() => setActiveTab("chain")}
            className={`pb-1 transition-colors ${
              activeTab === "chain"
                ? "text-[#F8FAFC] border-b-2 border-[#FF3E00] font-bold"
                : "text-[#5A6072] hover:text-[#8E9AA8]"
            }`}
          >
            CHAIN &amp; LAUNCHPAD
          </button>

          <button
            onClick={() => setActiveTab("token")}
            className={`pb-1 transition-colors ${
              activeTab === "token"
                ? "text-[#F8FAFC] border-b-2 border-[#FF3E00] font-bold"
                : "text-[#5A6072] hover:text-[#8E9AA8]"
            }`}
          >
            TOKEN DETAILS
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-1 transition-colors ${
              activeTab === "settings"
                ? "text-[#F8FAFC] border-b-2 border-[#FF3E00] font-bold"
                : "text-[#5A6072] hover:text-[#8E9AA8]"
            }`}
          >
            LAUNCH SETTINGS
          </button>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-6 pt-8">
        {/* ================= VIEW 1: CHAIN & LAUNCHPAD ================= */}
        {activeTab === "chain" && (
          <div className="space-y-7 animate-fadeIn">
            {/* Title & Description */}
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold text-[#F8FAFC] tracking-tight">
                Create a new launch
              </h1>
              <p className="text-[12px] text-[#717686]">
                Choose where your token will be launched and associated settings.
              </p>
            </div>

            {/* BLOCKCHAIN Selection */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                BLOCKCHAIN
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {chains.map((c) => {
                  const isSelected = selectedChain === c.id;
                  const isAvailable = c.isAvailable;

                  return (
                    <button
                      key={c.id}
                      disabled={!isAvailable}
                      onClick={() => {
                        if (isAvailable) setSelectedChain(c.id as any);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "border-[#31E3AC]/70 bg-[#0E1F1D] shadow-[0_0_15px_rgba(49,227,172,0.15)] ring-1 ring-[#31E3AC]/40"
                          : !isAvailable
                          ? "border-[#151720] bg-[#0A0B0F]/60 opacity-40 grayscale cursor-not-allowed"
                          : "border-[#1A1C25] bg-[#0E0F14] hover:border-[#2D3344]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={c.icon}
                            alt={c.name}
                            className={`w-4 h-4 object-contain rounded ${!isAvailable ? "opacity-50" : ""}`}
                          />
                          <span className={`font-semibold text-xs ${isAvailable ? "text-[#F8FAFC]" : "text-[#636879]"}`}>
                            {c.name}
                          </span>
                        </div>
                        {c.tag && (
                          <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30">
                            {c.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {c.subIcons.length > 0 && (
                          <div className="flex -space-x-1">
                            {c.subIcons.map((sub, i) => (
                              <img
                                key={i}
                                src={sub}
                                alt=""
                                className="w-3.5 h-3.5 rounded-full border border-[#111218] object-cover opacity-60"
                              />
                            ))}
                          </div>
                        )}
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${c.badgeColor}`}>
                          {c.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LAUNCHPAD Selection (3-Column Grid) */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                LAUNCHPAD
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {launchpadList.map((lp) => {
                  const isSelected = launchpad === lp.id;
                  return (
                    <button
                      key={lp.id}
                      onClick={() => setLaunchpad(lp.id)}
                      className={`h-[46px] px-3.5 rounded-lg border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? "border-[#31E3AC]/70 bg-[#0E1F1D] shadow-[0_0_15px_rgba(49,227,172,0.15)] ring-1 ring-[#31E3AC]/40"
                          : "border-[#1A1C25] bg-[#0E0F14] hover:border-[#2D3344] hover:bg-[#121319]"
                      }`}
                    >
                      <img
                        src={lp.icon}
                        alt={lp.name}
                        className="w-5 h-5 object-contain rounded flex-shrink-0"
                      />
                      <span className="font-medium text-[13px] text-[#F8FAFC] truncate">
                        {lp.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= LAUNCHPAD DETAILS PER SELECTION ================= */}

            {/* 1. PumpFun Selected Options (Screenshot 2) */}
            {launchpad === "PUMP_FUN" && (
              <div className="space-y-5 pt-1">
                {/* Launch Currency */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    LAUNCH CURRENCY
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setCurrency("SOL")}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                        currency === "SOL"
                          ? "border-[#31E3AC]/60 bg-[#0E1F1D]"
                          : "border-[#1A1C25] bg-[#0E0F14]"
                      }`}
                    >
                      <img src="/icons/chains/sol.webp" alt="SOL" className="w-4 h-4 object-contain" />
                      <div>
                        <div className="font-semibold text-xs text-[#F8FAFC]">Solana</div>
                        <div className="text-[9px] font-mono text-[#717686]">SOL</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrency("USDC")}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                        currency === "USDC"
                          ? "border-[#31E3AC]/60 bg-[#0E1F1D]"
                          : "border-[#1A1C25] bg-[#0E0F14]"
                      }`}
                    >
                      <img src="/icons/currencies/usdc.webp" alt="USDC" className="w-4 h-4 object-contain" />
                      <div>
                        <div className="font-semibold text-xs text-[#F8FAFC]">USD Coin</div>
                        <div className="text-[9px] font-mono text-[#717686]">USDC</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrency("CUSTOM")}
                      className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] text-[#717686] hover:text-[#F8FAFC] flex items-center justify-center text-xs"
                    >
                      + Custom
                    </button>
                  </div>
                </div>

                {/* Creator Rewards */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    CREATOR REWARDS
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setCreatorRewardTarget("CREATOR")}
                      className={`h-10 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        creatorRewardTarget === "CREATOR"
                          ? "border-[#31E3AC]/60 bg-[#0E1F1D] text-[#F8FAFC]"
                          : "border-[#1A1C25] bg-[#0E0F14] text-[#717686]"
                      }`}
                    >
                      <span>Creator</span>
                      <span className="text-[10px] text-[#717686]">ⓘ</span>
                    </button>
                    <button
                      onClick={() => setCreatorRewardTarget("HOLDERS")}
                      className={`h-10 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        creatorRewardTarget === "HOLDERS"
                          ? "border-[#31E3AC]/60 bg-[#0E1F1D] text-[#F8FAFC]"
                          : "border-[#1A1C25] bg-[#0E0F14] text-[#717686]"
                      }`}
                    >
                      <span>Holders</span>
                      <span className="text-[10px] text-[#717686]">ⓘ</span>
                    </button>
                  </div>
                </div>

                {/* Pump.Fun Specific Toggles */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    PUMP.FUN
                  </span>

                  <div className="space-y-2">
                    {/* otcdesks */}
                    <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#F8FAFC]">otcdesks</span>
                          <span className="text-[8px] font-bold font-mono px-1 rounded bg-[#3B82F6]/20 text-[#60A5FA]">NEW</span>
                        </div>
                        <div className="text-[11px] text-[#717686] leading-tight">
                          Assign the whole creator-fee stream to otcdesks. Holders are paid in a stock you pick — locked once the coin launches.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pumpOtcDesks}
                        onChange={(e) => setPumpOtcDesks(e.target.checked)}
                        className="accent-[#FF3E00] w-4 h-4 cursor-pointer mt-0.5"
                      />
                    </div>

                    {/* UsePaid */}
                    <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#F8FAFC]">UsePaid</span>
                          <span className="text-[8px] font-bold font-mono px-1 rounded bg-[#3B82F6]/20 text-[#60A5FA]">NEW</span>
                        </div>
                        <div className="text-[11px] text-[#717686] leading-tight">
                          Assign the whole creator-fee stream to UsePaid, which pays 80% of it in dollars to an X account. Permanent once the coin launches.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pumpUsePaid}
                        onChange={(e) => setPumpUsePaid(e.target.checked)}
                        className="accent-[#FF3E00] w-4 h-4 cursor-pointer mt-0.5"
                      />
                    </div>

                    {/* zaio.fun */}
                    <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#F8FAFC]">zaio.fun</span>
                          <span className="text-[8px] font-bold font-mono px-1 rounded bg-[#3B82F6]/20 text-[#60A5FA]">NEW</span>
                        </div>
                        <div className="text-[11px] text-[#717686] leading-tight">
                          List the coin on zaio.fun. Its pump.fun creator fees are split 50/50 between your dev wallet and zaio, permanently once the coin launches.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pumpZaio}
                        onChange={(e) => setPumpZaio(e.target.checked)}
                        className="accent-[#FF3E00] w-4 h-4 cursor-pointer mt-0.5"
                      />
                    </div>

                    {/* Ansem Launch */}
                    <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#F8FAFC]">Ansem Launch</span>
                          <span className="text-[8px] font-bold font-mono px-1 rounded bg-[#3B82F6]/20 text-[#60A5FA]">NEW</span>
                        </div>
                        <div className="text-[11px] text-[#717686] leading-tight">
                          Launch on pump.fun through Ansem. Extra SOL on the developer wallet buys supply for $ANSEM holders.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pumpAnsem}
                        onChange={(e) => setPumpAnsem(e.target.checked)}
                        className="accent-[#FF3E00] w-4 h-4 cursor-pointer mt-0.5"
                      />
                    </div>

                    {/* Creator Fee Distribution */}
                    <div className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-xs text-[#F8FAFC]">Creator Fee Distribution</span>
                        <div className="text-[11px] text-[#717686] leading-tight">
                          Split creator rewards before launch.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pumpCreatorFeeDist}
                        onChange={(e) => setPumpCreatorFeeDist(e.target.checked)}
                        className="accent-[#FF3E00] w-4 h-4 cursor-pointer mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Meteora DBC Selected Options (Screenshot 3) */}
            {launchpad === "METEORA_DBC" && (
              <div className="space-y-5 pt-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                      DBC CONFIG*
                    </span>
                    <span className="text-[10px] text-[#717686]">ⓘ</span>
                  </div>
                  <input
                    type="text"
                    placeholder="DBC config pubkey"
                    value={meteoraDbcConfigKey}
                    onChange={(e) => setMeteoraDbcConfigKey(e.target.value)}
                    className="w-full h-10 bg-[#0E0F14] border border-[#1A1C25] rounded-lg px-3 text-xs font-mono text-[#F8FAFC] outline-none focus:border-[#FF3E00]"
                  />
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <button className="text-[#FF7700] hover:underline flex items-center gap-1">
                      <span>⚙ Configure on Meteora</span>
                    </button>
                    <button className="text-[#8E9AA8] hover:text-[#F8FAFC] hover:underline flex items-center gap-1">
                      <span>📖 View guide</span>
                    </button>
                  </div>
                </div>

                {/* Launch Currency */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    LAUNCH CURRENCY
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setCurrency("SOL")}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                        currency === "SOL"
                          ? "border-[#31E3AC]/60 bg-[#0E1F1D]"
                          : "border-[#1A1C25] bg-[#0E0F14]"
                      }`}
                    >
                      <img src="/icons/chains/sol.webp" alt="SOL" className="w-4 h-4 object-contain" />
                      <div>
                        <div className="font-semibold text-xs text-[#F8FAFC]">Solana</div>
                        <div className="text-[9px] font-mono text-[#717686]">SOL</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrency("USDC")}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                        currency === "USDC"
                          ? "border-[#31E3AC]/60 bg-[#0E1F1D]"
                          : "border-[#1A1C25] bg-[#0E0F14]"
                      }`}
                    >
                      <img src="/icons/currencies/usdc.webp" alt="USDC" className="w-4 h-4 object-contain" />
                      <div>
                        <div className="font-semibold text-xs text-[#F8FAFC]">USD Coin</div>
                        <div className="text-[9px] font-mono text-[#717686]">USDC</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Find DBC Config by Quote */}
                <div className="space-y-2">
                  <span className="text-[11px] text-[#8E9AA8]">Find a DBC config by its quote</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Quote mint address"
                      value={meteoraQuoteMint}
                      onChange={(e) => setMeteoraQuoteMint(e.target.value)}
                      className="flex-1 h-10 bg-[#0E0F14] border border-[#1A1C25] rounded-lg px-3 text-xs font-mono text-[#F8FAFC] outline-none"
                    />
                    <button className="px-4 h-10 rounded-lg border border-[#1A1C25] bg-[#121319] hover:bg-[#181920] text-xs text-[#8E9AA8]">
                      Find
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Raydium LaunchLab Selected Options (Screenshot 4) */}
            {launchpad === "RAYDIUM_LAUNCHLAB" && (
              <div className="space-y-5 pt-1">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    RAYDIUM LAUNCHLAB
                  </span>
                  <div>
                    <label className="text-[11px] text-[#8E9AA8] block mb-1">Platform config ⓘ</label>
                    <input
                      type="text"
                      placeholder="Platform config address"
                      value={raydiumPlatformConfig}
                      onChange={(e) => setRaydiumPlatformConfig(e.target.value)}
                      className="w-full h-10 bg-[#0E0F14] border border-[#1A1C25] rounded-lg px-3 text-xs font-mono text-[#F8FAFC] outline-none"
                    />
                  </div>
                </div>

                {/* Launch Currency */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    LAUNCH CURRENCY
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setCurrency("SOL")}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2.5 ${
                        currency === "SOL" ? "border-[#31E3AC]/60 bg-[#0E1F1D]" : "border-[#1A1C25] bg-[#0E0F14]"
                      }`}
                    >
                      <img src="/icons/chains/sol.webp" alt="SOL" className="w-4 h-4 object-contain" />
                      <div>
                        <div className="font-semibold text-xs text-[#F8FAFC]">Solana</div>
                        <div className="text-[9px] font-mono text-[#717686]">SOL</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setCurrency("USD1")}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2.5 ${
                        currency === "USD1" ? "border-[#31E3AC]/60 bg-[#0E1F1D]" : "border-[#1A1C25] bg-[#0E0F14]"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#1C202B] flex items-center justify-center text-[10px]">?</div>
                      <div>
                        <div className="font-semibold text-xs text-[#F8FAFC]">USD1</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. StonkFun Selected Options (Screenshot 5) */}
            {launchpad === "STONK_FUN" && (
              <div className="space-y-5 pt-1">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    LAUNCH CURRENCY
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] text-left">
                      <div className="font-semibold text-xs text-[#F8FAFC]">USD.AI</div>
                      <div className="text-[9px] font-mono text-[#717686]">CHIP</div>
                    </button>
                    <button className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] text-left">
                      <div className="font-semibold text-xs text-[#F8FAFC]">ORE</div>
                      <div className="text-[9px] font-mono text-[#717686]">ORE</div>
                    </button>
                    <button className="p-3 rounded-lg border border-[#31E3AC]/60 bg-[#0E1F1D] text-left">
                      <div className="font-semibold text-xs text-[#F8FAFC]">Custom</div>
                      <div className="text-[9px] font-mono text-[#717686]">SOL</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    FEE MODEL
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setStonkFeeModel("Standard")}
                      className={`h-10 rounded-lg border text-xs font-medium ${
                        stonkFeeModel === "Standard" ? "border-[#31E3AC]/60 bg-[#0E1F1D] text-[#F8FAFC]" : "border-[#1A1C25] bg-[#0E0F14] text-[#717686]"
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setStonkFeeModel("Rewards")}
                      className={`h-10 rounded-lg border text-xs font-medium ${
                        stonkFeeModel === "Rewards" ? "border-[#31E3AC]/60 bg-[#0E1F1D] text-[#F8FAFC]" : "border-[#1A1C25] bg-[#0E0F14] text-[#717686]"
                      }`}
                    >
                      Rewards
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. LetsBonk Selected Options (Screenshot 6) */}
            {launchpad === "LETS_BONK" && (
              <div className="space-y-5 pt-1">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                    LAUNCH CURRENCY
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button className="p-3 rounded-lg border border-[#31E3AC]/60 bg-[#0E1F1D] text-left flex items-center gap-2.5">
                      <img src="/icons/chains/sol.webp" alt="SOL" className="w-4 h-4 object-contain" />
                      <div>
                        <div className="font-semibold text-xs text-[#F8FAFC]">Solana</div>
                        <div className="text-[9px] font-mono text-[#717686]">SOL</div>
                      </div>
                    </button>
                    <button className="p-3 rounded-lg border border-[#1A1C25] bg-[#0E0F14] text-left flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#1C202B] flex items-center justify-center text-[10px]">?</div>
                      <div className="font-semibold text-xs text-[#F8FAFC]">USD1</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Bags Selected Options (Screenshot 7) */}
            {launchpad === "BAGS" && (
              <div className="space-y-4 pt-1">
                <label className="p-3.5 rounded-lg border border-[#1A1C25] bg-[#0E0F14] flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-[#8E9AA8]">Share Fees (optional)</span>
                  <input
                    type="checkbox"
                    checked={bagsShareFees}
                    onChange={(e) => setBagsShareFees(e.target.checked)}
                    className="accent-[#FF3E00] w-4 h-4"
                  />
                </label>
              </div>
            )}

            {/* 7. Anoncoin Selected Options (Screenshot 8) */}
            {launchpad === "ANONCOIN" && (
              <div className="space-y-3 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                  ANONCOIN API KEY
                </span>
                <input
                  type="text"
                  placeholder="Enter your Anoncoin API key"
                  value={anoncoinApiKey}
                  onChange={(e) => setAnoncoinApiKey(e.target.value)}
                  className="w-full h-10 bg-[#0E0F14] border border-[#1A1C25] rounded-lg px-3 text-xs font-mono text-[#F8FAFC] outline-none"
                />
                <div className="p-2.5 bg-[#10192A] border border-[#1D3256] rounded-lg text-[11px] text-[#60A5FA] flex items-center gap-2">
                  <span>ⓘ</span>
                  <span>API key must be linked to a X/Twitter account with less than 1M followers.</span>
                </div>
              </div>
            )}

            {/* Bottom Actions: 1:1 Proxima screenshot (Configure Token, OR, Clone, Import) */}
            <div className="space-y-4 pt-6 border-t border-[#1A1C25]">
              <div className="flex justify-center">
                <button
                  onClick={() => setActiveTab("token")}
                  className="w-full max-w-[280px] h-[40px] rounded-lg bg-[#14151D] hover:bg-[#1A1C26] border border-[#222432] text-[#8E9AA8] hover:text-[#F8FAFC] font-medium text-xs tracking-wide transition-all shadow-sm"
                >
                  Configure Token
                </button>
              </div>

              <div className="flex items-center gap-3 w-full max-w-[280px] mx-auto text-[#4A5064] text-[10px] font-mono">
                <div className="flex-1 h-[1px] bg-[#161720]" />
                <span>OR</span>
                <div className="flex-1 h-[1px] bg-[#161720]" />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => alert("Clone an existing token address")}
                  className="px-4 h-8 rounded-lg bg-[#111218] border border-[#1A1C25] hover:border-[#2D3344] text-[11px] text-[#8E9AA8] hover:text-[#F8FAFC] flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  <span>Clone a Token</span>
                </button>
                <button
                  onClick={() => alert("Import existing token")}
                  className="px-4 h-8 rounded-lg bg-[#111218] border border-[#1A1C25] hover:border-[#2D3344] text-[11px] text-[#8E9AA8] hover:text-[#F8FAFC] flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  <span>Import a Token</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: TOKEN DETAILS (1:1 Screenshot 9) ================= */}
        {activeTab === "token" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold text-[#F8FAFC] tracking-tight">
                Token Details
              </h1>
              <p className="text-[12px] text-[#717686]">
                Define how your token will appear on explorers, wallets, and launchpads.
              </p>
            </div>

            <div className="space-y-4">
              {/* Project Name & Symbol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#8E9AA8]">
                    Project Name* <span className="text-[#565B6D] font-normal">(0/32)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={32}
                    placeholder="SCRAMJET"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full h-10 bg-[#0E0F14] border border-[#1A1C25] focus:border-[#FF3E00] rounded-lg px-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#8E9AA8]">
                    Symbol* <span className="text-[#565B6D] font-normal">(0/10)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="SCRAM"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="w-full h-10 bg-[#0E0F14] border border-[#1A1C25] focus:border-[#FF3E00] rounded-lg px-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[#8E9AA8]">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter a description..."
                  value={tokenDescription}
                  onChange={(e) => setTokenDescription(e.target.value)}
                  className="w-full bg-[#0E0F14] border border-[#1A1C25] focus:border-[#FF3E00] rounded-lg p-3 text-xs text-[#F8FAFC] outline-none"
                />
              </div>

              {/* Image Upload Dropzone + Preview Box */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono text-[#8E9AA8]">
                  <span>Image*</span>
                  <span>PREVIEW</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Upload Box (Col 3) */}
                  <label className="sm:col-span-3 h-28 border border-dashed border-[#222432] hover:border-[#FF3E00]/50 rounded-xl bg-[#0E0F14] flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#717686" strokeWidth="2" className="mb-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div className="text-xs text-[#8E9AA8]">
                      Drag &amp; Drop or <span className="text-[#3B82F6] hover:underline font-medium">Choose file</span> to upload
                    </div>
                    <div className="text-[10px] text-[#565B6D] mt-0.5 font-mono">
                      .jpg, .png, or .gif (Max 2 MB)
                    </div>
                  </label>

                  {/* Preview Box (Col 1) */}
                  <div className="h-28 rounded-xl border border-[#1A1C25] bg-[#0B0C10] flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222532" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#717686]">X/ Twitter (optional)</label>
                  <input
                    type="text"
                    placeholder="x.com/scramjet"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full h-9 bg-[#0E0F14] border border-[#1A1C25] rounded-lg px-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#717686]">Telegram (optional)</label>
                  <input
                    type="text"
                    placeholder="t.me/scramjet"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full h-9 bg-[#0E0F14] border border-[#1A1C25] rounded-lg px-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#717686]">Website (optional)</label>
                  <input
                    type="text"
                    placeholder="scramjet.tools"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full h-9 bg-[#0E0F14] border border-[#1A1C25] rounded-lg px-3 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              {/* Centered Create Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setActiveTab("settings")}
                  className="w-full max-w-[280px] h-[40px] rounded-lg bg-[#14151D] hover:bg-[#1A1C26] border border-[#222432] text-[#8E9AA8] hover:text-[#F8FAFC] font-medium text-xs tracking-wide transition-all shadow-sm"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: LAUNCH SETTINGS (Block-0, Organic, Manual) ================= */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Title & Description */}
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold text-[#F8FAFC] tracking-tight">
                Launch Settings
              </h1>
              <p className="text-[12px] text-[#717686]">
                Configure Block-0 bundle timing, wallet allocations, and sniper defense.
              </p>
            </div>

            {/* 3 Large Launch Mode Cards */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
                CHOOSE LAUNCH MODE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setLaunchMode("BLOCK_0")}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    launchMode === "BLOCK_0"
                      ? "border-[#31E3AC]/70 bg-[#0E1F1D] text-[#F8FAFC] shadow-[0_0_18px_rgba(49,227,172,0.15)] ring-1 ring-[#31E3AC]/40"
                      : "border-[#1A1C25] bg-[#0E0F14] text-[#8E9AA8] hover:border-[#2D3344]"
                  }`}
                >
                  <div className="font-bold text-sm text-[#F8FAFC]">Block-0 Mode</div>
                  <div className="text-[10px] text-[#8E9AA8]">Atomic multi-wallet MEV bundle</div>
                </button>

                <button
                  onClick={() => setLaunchMode("ORGANIC")}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    launchMode === "ORGANIC"
                      ? "border-[#31E3AC]/70 bg-[#0E1F1D] text-[#F8FAFC] shadow-[0_0_18px_rgba(49,227,172,0.15)] ring-1 ring-[#31E3AC]/40"
                      : "border-[#1A1C25] bg-[#0E0F14] text-[#8E9AA8] hover:border-[#2D3344]"
                  }`}
                >
                  <div className="font-bold text-sm text-[#F8FAFC]">Organic Mode</div>
                  <div className="text-[10px] text-[#8E9AA8]">Sequential buys with buy delay</div>
                </button>

                <button
                  onClick={() => setLaunchMode("MANUAL")}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    launchMode === "MANUAL"
                      ? "border-[#31E3AC]/70 bg-[#0E1F1D] text-[#F8FAFC] shadow-[0_0_18px_rgba(49,227,172,0.15)] ring-1 ring-[#31E3AC]/40"
                      : "border-[#1A1C25] bg-[#0E0F14] text-[#8E9AA8] hover:border-[#2D3344]"
                  }`}
                >
                  <div className="font-bold text-sm text-[#F8FAFC]">Manual Mode</div>
                  <div className="text-[10px] text-[#8E9AA8]">Submit orders yourself in HUD</div>
                </button>
              </div>
            </div>

            {/* Presets and Inputs */}
            <div className="p-5 rounded-xl border border-[#1A1C25] bg-[#0E0F14] space-y-4">
              <div className="flex justify-between items-center border-b border-[#1A1C25] pb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#717686] font-semibold">
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
                          : "border-[#1C202B] text-[#8E9AA8] bg-[#0B0C10]"
                      }`}
                    >
                      {p.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Developer Buy % & Holders Buy % */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-[#1A1C25] bg-[#08090C] space-y-1.5">
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
                      className="w-full h-10 bg-[#0E0F14] border border-[#1A1C25] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#717686] font-mono">%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-[#1A1C25] bg-[#08090C] space-y-1.5">
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
                      className="w-full h-10 bg-[#0E0F14] border border-[#1A1C25] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#717686] font-mono">%</span>
                  </div>
                </div>
              </div>

              {/* Back MEV Tuning Slider */}
              <div className="p-3.5 rounded-lg border border-[#1A1C25] bg-[#08090C] space-y-2">
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
                <div className="flex justify-between text-[10px] text-[#717686] font-mono">
                  <span>← Fewer sniper markers</span>
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
                    className="w-full h-10 bg-[#08090C] border border-[#1A1C25] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#8E9AA8] block mb-1">Jito Block-0 Bribe (SOL)</label>
                  <input
                    type="number"
                    step="0.005"
                    value={jitoTipSol}
                    onChange={(e) => setJitoTipSol(Number(e.target.value))}
                    className="w-full h-10 bg-[#08090C] border border-[#1A1C25] rounded px-3 text-xs font-mono text-[#F8FAFC]"
                  />
                </div>
              </div>
            </div>

            {/* Final Launch Fee & Execution Summary */}
            <div className="p-5 rounded-xl border border-[#FF3E00]/40 bg-[#0E0F14] space-y-3 font-mono text-xs shadow-[0_0_20px_rgba(255,62,0,0.1)]">
              <div className="flex justify-between items-center border-b border-[#1A1C25] pb-2">
                <span className="font-bold text-[#F8FAFC]">FINAL STEP: LAUNCH FEE &amp; DISPATCH SUMMARY</span>
                <span className="text-[10px] text-[#31E3AC]">SOLANA MAINNET</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-[#8E9AA8]">
                  <span>Base Deployment Fee:</span>
                  <span className="font-bold text-[#F8FAFC]">{upfrontFee.baseFeeSol.toFixed(3)} SOL</span>
                </div>
                <div className="flex justify-between text-[#8E9AA8]">
                  <span>Sub-Wallet Coordination ({holderCount} wallets × 0.005 SOL):</span>
                  <span className="font-bold text-[#F8FAFC]">+{upfrontFee.walletExecutionFeeSol.toFixed(3)} SOL</span>
                </div>
                {devBuyPercent > 0 && (
                  <div className="flex justify-between text-[#8E9AA8]">
                    <span>Developer Buy Allocation ({devBuyPercent}%):</span>
                    <span className="font-bold text-[#F8FAFC]">{((devBuyPercent / 100) * 10).toFixed(3)} SOL</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8E9AA8]">
                  <span>Jito Priority Leader Bribe:</span>
                  <span className="font-bold text-[#F8FAFC]">{jitoTipSol.toFixed(3)} SOL</span>
                </div>
                <div className="flex justify-between text-[12px] pt-2 border-t border-[#1C202B] font-bold items-center">
                  <span className="text-[#FF3E00]">Total Launch Fee:</span>
                  <div className="flex items-center gap-2">
                      {isExempt && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#31E3AC]/20 text-[#31E3AC] border border-[#31E3AC]/30 font-bold">
                        VIP EXEMPT (0 FEE)
                      </span>
                    )}
                    <span className={isExempt ? "text-[#31E3AC] line-through opacity-50" : "text-[#31E3AC]"}>
                      {upfrontFee.totalLaunchFeeSol.toFixed(3)} SOL
                    </span>
                    {isExempt && <span className="text-[#31E3AC]">0.000 SOL</span>}
                  </div>
                </div>
                <div className="text-[10px] text-[#717686] pt-1">
                  Fee recipient: {DEFAULT_PLATFORM_FEE_VAULT.toBase58().slice(0, 4)}...{DEFAULT_PLATFORM_FEE_VAULT.toBase58().slice(-4)}
                </div>
              </div>
            </div>

            {/* Pay Launch Fee & Dispatch Button */}
            <div className="flex flex-col items-center gap-3 pt-4">
              {dispatchError && (
                <div className="p-3 rounded-lg bg-[#FF2A55]/10 border border-[#FF2A55]/30 text-[#FF2A55] text-xs font-mono max-w-md text-center">
                    {dispatchError}
                  </div>
                )}

                {isDispatching && (
                  <div className="p-3 rounded-lg bg-[#14151C] border border-[#FF3E00]/40 text-[#FF3E00] text-xs font-mono max-w-md text-center animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-ping" />
                  <span>{dispatchStep}</span>
                </div>
              )}

              <button
                onClick={handleDispatchBundle}
                disabled={isDispatching}
                className="w-full max-w-[340px] h-[48px] rounded-lg bg-[#FF3E00] hover:bg-[#FF5500] disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(255,62,0,0.45)] hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isDispatching
                    ? "Dispatching Block-0..."
                    : `Pay Launch Fee & Dispatch (${upfrontFee.totalLaunchFeeSol} SOL) →`}
                </span>
              </button>
            </div>

            {/* Dispatch Success Modal / Card */}
            {dispatchResult && (
              <div className="mt-6 p-5 rounded-xl border border-[#31E3AC]/50 bg-[#0E1F1D] space-y-3 font-mono text-xs animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-[#1C5449]">
                  <span className="text-[#31E3AC] font-bold text-sm">✓ BLOCK-0 BUNDLE SUBMITTED</span>
                  <span className="text-[10px] text-[#8E9AA8]">CONFIRMING ON-CHAIN</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#8E9AA8]">Token Mint:</span>
                    <span className="font-bold text-[#F8FAFC]">{dispatchResult.mintPublicKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9AA8]">Jito Bundle ID:</span>
                    <span className="font-bold text-[#38BDF8] truncate max-w-xs">{dispatchResult.bundleId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9AA8]">Sub-Wallets Seeded:</span>
                    <span className="font-bold text-[#31E3AC]">{dispatchResult.subWalletsCount} Wallets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9AA8]">Solana Explorer:</span>
                    <a
                      href={`https://explorer.solana.com/address/${dispatchResult.mintPublicKey}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#60A5FA] underline hover:text-white"
                    >
                      View Mint on Explorer ↗
                    </a>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#1C5449] flex justify-end">
                  <Link
                    href={`/workspace?mint=${dispatchResult.mintPublicKey}`}
                    className="px-5 py-2 rounded-lg bg-[#31E3AC] hover:bg-[#34D399] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(49,227,172,0.3)]"
                  >
                    Open Live Trading Cockpit →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
