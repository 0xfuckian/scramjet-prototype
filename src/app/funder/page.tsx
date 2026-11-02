"use client";

import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import type { GhostFunderConfig } from "../../types";
import { GhostFunder } from "../../lib/wallets/ghostFunder";
import { useLaunchStore } from "../../lib/stores/useLaunchStore";

export default function FunderPage() {
  const connectedWallet = useLaunchStore((state) => state.connectedWallet);
  const masterBalanceSol = useLaunchStore((state) => state.masterBalanceSol);
  const subWallets = useLaunchStore((state) => state.subWallets);
  const folders = useLaunchStore((state) => state.folders);
  const reclaimedRentSol = useLaunchStore((state) => state.reclaimedRentSol);
  const lastActionMessage = useLaunchStore((state) => state.lastActionMessage);
  const activeLaunchConfig = useLaunchStore((state) => state.activeLaunchConfig);
  const setConnectedWallet = useLaunchStore((state) => state.setConnectedWallet);
  const updateLaunchConfig = useLaunchStore((state) => state.updateLaunchConfig);
  const addWalletsToFolder = useLaunchStore((state) => state.addWalletsToFolder);
  const executeAtaRentReclaim = useLaunchStore((state) => state.executeAtaRentReclaim);
  const startSlotFeed = useLaunchStore((state) => state.startSlotFeed);
  const refreshWalletBalances = useLaunchStore((state) => state.refreshWalletBalances);

  const [walletInput, setWalletInput] = useState("");
  const [activeFolderId, setActiveFolderId] = useState("box1");
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [fundingMode, setFundingMode] = useState<"CEX_API_DIRECT" | "RELAY_MERKLE_TREE" | "CLASSIC">(
    "RELAY_MERKLE_TREE"
  );
  const [selectedExchange, setSelectedExchange] = useState<"OKX" | "BINANCE" | "BYBIT">("OKX");
  const [randomDeviation, setRandomDeviation] = useState(5); // ±5% jitter
  const [fundingGapMin, setFundingGapMin] = useState(30);

  // Micro-funding
  const [subWalletMinSol, setSubWalletMinSol] = useState(0.01);
  const [autoReclaimRent, setAutoReclaimRent] = useState(true);

  useEffect(() => {
    startSlotFeed();
    void refreshWalletBalances();
  }, [refreshWalletBalances, startSlotFeed]);

  const ghostConfig = (): GhostFunderConfig => ({
    fundingMode: fundingMode === "CLASSIC" ? "CLASSIC_DISPERSION" : fundingMode,
    cexExchange: selectedExchange,
    fundingGapSeconds: fundingGapMin * 60,
    randomDeviationPercent: randomDeviation,
  });

  const connectMaster = () => {
    try {
      const pubkey = new PublicKey(walletInput.trim());
      setPageMessage(null);
      void setConnectedWallet(pubkey);
    } catch {
      setPageMessage("Enter a valid master wallet public key.");
    }
  };

  const disperseFunds = () => {
    const config = ghostConfig();
    const targets = subWallets.filter((wallet) => wallet.folderId === activeFolderId);
    const prepared = (targets.length > 0 ? targets : subWallets).map((wallet) => ({
      ...wallet,
      folderId: wallet.folderId ?? activeFolderId,
      allocatedBuySol: Math.max(wallet.allocatedBuySol, subWalletMinSol),
    }));

    updateLaunchConfig({
      ghostFunder: config,
      devBuySol: Math.max(activeLaunchConfig.devBuySol, subWalletMinSol),
    });

    if (!connectedWallet) {
      setPageMessage("Connect the master wallet before dispersing funds.");
      void addWalletsToFolder(activeFolderId, prepared);
      return;
    }

    const plan = GhostFunder.planGhostDispersal({
      masterPayer: connectedWallet,
      subWallets: prepared,
      config,
    });
    setPageMessage(
      `Planned ${plan.relays.length} relays and ${plan.instructions.length} funding transfers (${plan.totalSolRequired} SOL). Master signer required to broadcast.`
    );
    void addWalletsToFolder(activeFolderId, prepared);
  };

  const sweepEmptyAtas = () => {
    if (!autoReclaimRent) {
      setPageMessage("Enable automated rent reclamation before sweeping.");
      return;
    }
    if (!connectedWallet) {
      setPageMessage("Connect the master wallet that should receive reclaimed rent.");
      return;
    }
    setPageMessage(null);
    void executeAtaRentReclaim(connectedWallet);
  };

  const shortenKey = (value: string) =>
    value.length > 12 ? `${value.slice(0, 4)}...${value.slice(-4)}` : value;

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
        <div className="text-right space-y-1">
          <div className="text-[10px] text-scram-titanium uppercase">Master Funder Balance</div>
          <div className="text-base font-bold text-emerald-400">{masterBalanceSol.toFixed(4)} SOL</div>
          <div className="text-[10px] text-scram-titanium">
            {connectedWallet ? shortenKey(connectedWallet.toBase58()) : "No wallet connected"}
          </div>
          <div className="flex items-center justify-end gap-1">
            <input
              type="text"
              value={walletInput}
              onChange={(event) => setWalletInput(event.target.value)}
              placeholder="Master public key"
              className="w-44 bg-scram-void border border-scram-border p-1.5 rounded text-scram-stark font-mono text-[10px]"
            />
            <button
              onClick={connectMaster}
              className="text-[10px] bg-scram-plasma/10 text-scram-plasma border border-scram-plasma/30 px-2 py-1 rounded font-bold"
            >
              Connect
            </button>
          </div>
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
                onClick={() => {
                  const id = `box${folders.length + 1}`;
                  setActiveFolderId(id);
                  void addWalletsToFolder(id, []);
                }}
                className="text-[10px] bg-scram-plasma/10 text-scram-plasma border border-scram-plasma/30 px-2 py-0.5 rounded font-bold"
              >
                + New Folder
              </button>
            </div>

            <div className="space-y-2">
              {folders.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFolderId(f.id)}
                  className={`w-full text-left p-3 bg-scram-card border hover:border-scram-hover rounded space-y-1 transition-all ${
                    activeFolderId === f.id ? "border-scram-plasma" : "border-scram-border"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-scram-stark text-xs">{f.name}</span>
                    <span className="text-[10px] text-scram-plasma font-bold">
                      {f.walletCount} wallets
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-scram-titanium">
                    <span>Balance: {f.totalBalanceSol.toFixed(4)} SOL</span>
                    <span>{activeFolderId === f.id ? "Selected" : "Ready"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ATA Rent Reclaim Card */}
          <div className="bg-scram-surface border border-emerald-500/30 p-4 rounded space-y-2 bg-emerald-500/5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-400 text-xs">Automated Rent Reclamation</span>
              <label className="flex items-center gap-1 text-[9px] text-scram-stark">
                <input
                  type="checkbox"
                  checked={autoReclaimRent}
                  onChange={(event) => setAutoReclaimRent(event.target.checked)}
                  className="accent-emerald-400"
                />
                {autoReclaimRent ? "ACTIVE" : "PAUSED"}
              </label>
            </div>
            <p className="text-[10px] text-scram-titanium leading-relaxed">
              When sub-wallets sell out, SCRAMJET automatically closes empty token accounts (ATAs),
              returning ~0.00204 SOL rent per wallet back to your funder.
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20 text-[11px]">
              <span className="text-scram-stark">Reclaimed Today:</span>
              <span className="text-emerald-400 font-bold font-mono">+{reclaimedRentSol.toFixed(4)} SOL</span>
            </div>
            <button
              onClick={sweepEmptyAtas}
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
                <span className="text-emerald-400 font-bold text-sm">{subWalletMinSol.toFixed(3)} SOL</span>
                <div className="text-[9px] text-scram-titanium">+0.001 SOL fee</div>
              </div>
            </div>

            <button
              onClick={disperseFunds}
              className="w-full bg-scram-plasma hover:bg-scram-flare text-black font-bold py-3 rounded uppercase tracking-wider text-xs shadow-plasma transition-all"
            >
              Disperse Funds Across Wallets →
            </button>
            {(pageMessage || lastActionMessage) && (
              <p className="text-[10px] text-scram-titanium leading-relaxed break-all">
                {pageMessage ?? lastActionMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
