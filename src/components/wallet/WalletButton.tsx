"use client";

import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useLaunchStore } from "../../lib/stores/useLaunchStore";
import { getSolBalance } from "../../lib/solana/connection";

declare global {
  interface Window {
    solana?: any;
    phantom?: any;
  }
}

export function WalletButton() {
  const { connectedWallet, walletBalanceSol, setConnectedWallet } = useLaunchStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasPhantom(Boolean(window.solana?.isPhantom || window.phantom?.solana));
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const provider = window.phantom?.solana || window.solana;

      if (!provider) {
        // Fallback demo connection with the user's configured vault address
        const demoPubkey = new PublicKey("CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq");
        setConnectedWallet(demoPubkey);
        setIsConnecting(false);
        return;
      }

      const resp = await provider.connect();
      const pubkey = new PublicKey(resp.publicKey.toString());
      setConnectedWallet(pubkey);

      const bal = await getSolBalance(pubkey);
      useLaunchStore.setState({ walletBalanceSol: bal });
    } catch (err) {
      console.warn("Wallet connect failed or rejected, falling back to vault:", err);
      const fallback = new PublicKey("CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq");
      setConnectedWallet(fallback);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
  };

  if (connectedWallet) {
    const address = connectedWallet.toBase58();
    const short = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return (
      <div className="flex items-center space-x-2 bg-scram-card border border-scram-plasma/40 px-3 py-1.5 rounded text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-scram-stark font-bold">{short}</span>
        <span className="text-scram-titanium font-semibold">
          ({walletBalanceSol.toFixed(2)} SOL)
        </span>
        <button
          onClick={disconnectWallet}
          className="text-[10px] text-scram-titanium hover:text-red-400 ml-1"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-scram-plasma hover:bg-scram-flare text-black font-bold px-4 py-1.5 rounded text-xs tracking-wider uppercase transition-all shadow-plasma flex items-center space-x-1.5"
    >
      <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  );
}
