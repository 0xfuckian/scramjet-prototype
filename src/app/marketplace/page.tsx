"use client";

import React, { useState } from "react";
import { MarketplaceWalletItem, WarmedWalletTier } from "../../types";

export default function MarketplacePage() {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(50);
  const [fundingGap, setFundingGap] = useState<string>("30m");
  const [min1DayOld, setMin1DayOld] = useState<boolean>(true);
  const [targetFolder, setTargetFolder] = useState<string>("box1");

  // Sample Inventory reflecting Proxima screenshot structure + SCRAMJET tiers
  const [inventory] = useState<MarketplaceWalletItem[]>([
    {
      id: "w-1",
      tier: "STANDARD_DEGEN",
      traderPersona: "Memecoin Degen",
      region: "Asia",
      ageDays: 1,
      lifetimeTxCount: 1,
      fundingSource: "Classic",
      preLoadedBalanceSol: 0.088,
      netFeeSol: 0.045,
      totalPriceSol: 0.133,
      selected: true,
    },
    {
      id: "w-2",
      tier: "STANDARD_DEGEN",
      traderPersona: "Memecoin Degen",
      region: "Europe",
      ageDays: 23,
      lifetimeTxCount: 1,
      fundingSource: "Classic",
      preLoadedBalanceSol: 0.069,
      netFeeSol: 0.035,
      totalPriceSol: 0.104,
      selected: true,
    },
    {
      id: "w-3",
      tier: "ACTIVE_TRADER",
      traderPersona: "Organic Trader",
      region: "Asia",
      ageDays: 25,
      lifetimeTxCount: 12,
      fundingSource: "KuCoin",
      preLoadedBalanceSol: 0.115,
      netFeeSol: 0.057,
      totalPriceSol: 0.172,
      selected: true,
    },
    {
      id: "w-4",
      tier: "ACTIVE_TRADER",
      traderPersona: "Organic Trader",
      region: "Europe",
      ageDays: 1,
      lifetimeTxCount: 8,
      fundingSource: "Bitstamp",
      preLoadedBalanceSol: 0.082,
      netFeeSol: 0.041,
      totalPriceSol: 0.123,
      selected: true,
    },
    {
      id: "w-5",
      tier: "GHOST_WHALE",
      traderPersona: "Memecoin Degen",
      region: "US East",
      ageDays: 32,
      lifetimeTxCount: 28,
      fundingSource: "Binance",
      preLoadedBalanceSol: 0.097,
      netFeeSol: 0.068,
      totalPriceSol: 0.165,
      selected: true,
    },
  ]);

  // Aggregate cart math modeled on Proxima screenshot (2.42 SOL balance + 4.39 SOL net fee = 6.81 SOL)
  const totalBalance = 2.42;
  const netPrice = 4.39;
  const totalPrice = 6.81;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-mono text-xs space-y-6">
      <div className="flex justify-between items-center border-b border-scram-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-scram-stark uppercase tracking-wider">
            Warmed Wallet Marketplace
          </h1>
          <p className="text-scram-titanium text-[11px] mt-0.5">
            Pre-loaded with real SOL, aged multi-DEX transaction history, and anti-BubbleMap provenance.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-scram-card px-3 py-1.5 rounded border border-scram-border">
          <span className="text-scram-titanium">Available Inventory:</span>
          <span className="text-scram-plasma font-bold">230 Verified Wallets</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Controls & Cart Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-scram-surface border border-scram-border p-4 rounded space-y-4">
            {/* Number of Wallets */}
            <div>
              <label className="text-[10px] text-scram-titanium block mb-1.5 uppercase font-semibold">
                Number of Wallets
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[25, 50, 100, 200].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setSelectedQuantity(qty)}
                    className={`py-1.5 rounded text-center border font-bold text-[11px] ${
                      selectedQuantity === qty
                        ? "border-scram-plasma bg-scram-plasma text-black"
                        : "border-scram-border text-scram-stark bg-scram-card hover:border-scram-hover"
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Funding Gap */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-scram-titanium uppercase font-semibold">
                  Funding Gap
                </span>
                <span className="text-[9px] bg-scram-plasma/20 text-scram-plasma px-1 rounded font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-[9px] text-scram-titanium mb-2">
                Keep funding timestamps apart to break BubbleMaps time-node clustering.
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {["30m", "1H", "12H"].map((gap) => (
                  <button
                    key={gap}
                    onClick={() => setFundingGap(gap)}
                    className={`py-1 rounded text-center border text-[10px] ${
                      fundingGap === gap
                        ? "border-scram-plasma bg-scram-plasma/20 text-scram-stark font-bold"
                        : "border-scram-border text-scram-titanium bg-scram-card"
                    }`}
                  >
                    {gap}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum 1 Day Old */}
            <div className="p-2.5 bg-scram-card border border-scram-border rounded flex justify-between items-center">
              <div>
                <div className="text-scram-stark font-semibold text-[11px]">Minimum 1 Day Old</div>
                <div className="text-[9px] text-scram-titanium">Past Photon "fresh" flag</div>
              </div>
              <input
                type="checkbox"
                checked={min1DayOld}
                onChange={(e) => setMin1DayOld(e.target.checked)}
                className="accent-scram-plasma"
              />
            </div>

            {/* Folder Destination */}
            <div>
              <label className="text-[10px] text-scram-titanium block mb-1 uppercase font-semibold">
                Add to Folder
              </label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                className="w-full bg-scram-void border border-scram-border p-2 rounded text-scram-stark"
              >
                <option value="box1">box1 (Launch Cohort)</option>
                <option value="mev-front">mev-front (Block-0)</option>
                <option value="holders">holders (Long Term)</option>
              </select>
            </div>

            {/* Cart Breakdown */}
            <div className="border-t border-scram-border pt-4 space-y-2">
              <div className="flex justify-between text-scram-titanium">
                <span>Total Balances:</span>
                <span className="text-scram-stark font-mono">{totalBalance} SOL</span>
              </div>
              <div className="flex justify-between text-scram-titanium">
                <span>Net Markup Fee:</span>
                <span className="text-scram-plasma font-mono">+{netPrice} SOL</span>
              </div>
              <div className="flex justify-between text-scram-stark font-bold text-sm border-t border-scram-border/50 pt-2">
                <span>Checkout Total:</span>
                <span className="text-scram-plasma">{totalPrice} SOL</span>
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  `Purchased ${selectedQuantity} warmed wallets for ${totalPrice} SOL into folder ${targetFolder}!`
                )
              }
              className="w-full bg-scram-plasma hover:bg-scram-flare text-black font-bold py-3 rounded uppercase tracking-wider text-xs shadow-plasma transition-all"
            >
              Buy {selectedQuantity} Wallets • {totalPrice} SOL
            </button>
          </div>
        </div>

        {/* Right Area: Wallet Inventory Table */}
        <div className="lg:col-span-3 bg-scram-surface border border-scram-border p-4 rounded space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-scram-stark text-xs">
              Verified Marketplace Inventory
            </span>
            <span className="text-[10px] text-scram-titanium">
              SOL Price Index: $93.85
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-scram-border text-[10px] text-scram-titanium uppercase">
                  <th className="py-2 px-2">Trader Persona</th>
                  <th className="py-2 px-2">Region & TXs</th>
                  <th className="py-2 px-2">Balance</th>
                  <th className="py-2 px-2">Total Price</th>
                  <th className="py-2 px-2">Net Cost</th>
                  <th className="py-2 px-2">Funding Source</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((w, idx) => (
                  <tr
                    key={w.id}
                    className="border-b border-scram-border/50 hover:bg-scram-card/50 text-[11px]"
                  >
                    <td className="py-2.5 px-2 font-semibold text-scram-stark">
                      <div>{w.traderPersona}</div>
                      <div className="text-[9px] text-scram-titanium">{w.tier.replace("_", " ")}</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="text-scram-stark">{w.region}</div>
                      <div className="text-[9px] text-emerald-400">{w.lifetimeTxCount} txs • {w.ageDays}d ago</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-bold text-scram-stark">{w.preLoadedBalanceSol} SOL</div>
                      <div className="text-[9px] text-scram-titanium">
                        ≈${(w.preLoadedBalanceSol * 93.85).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-scram-plasma">
                      <div>{w.totalPriceSol} SOL</div>
                      <div className="text-[9px] text-scram-titanium">
                        ≈${(w.totalPriceSol * 93.85).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-scram-titanium font-mono">
                      +{w.netFeeSol} SOL
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-scram-card border border-scram-border font-semibold text-scram-stark">
                        {w.fundingSource} ({w.ageDays}d ago)
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
  );
}
