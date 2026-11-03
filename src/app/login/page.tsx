"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import { useLaunchStore } from "../../lib/stores/useLaunchStore";

export default function LoginPage() {
  const router = useRouter();
  const { setConnectedWallet } = useLaunchStore();
  const [isMigrating, setIsMigrating] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "email">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const handleMigrateLicenseKey = async () => {
    setIsMigrating(true);
    try {
      // Check Phantom or connect via Turnkey vault
      if (typeof window !== "undefined" && (window.phantom?.solana || window.solana)) {
        const provider = window.phantom?.solana || window.solana;
        const resp = await provider.connect();
        const pk = new PublicKey(resp.publicKey.toString());
        setConnectedWallet(pk);
      } else {
        // Vault fallback
        const defaultVault = new PublicKey("CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq");
        setConnectedWallet(defaultVault);
      }
      router.push("/workspace");
    } catch {
      const defaultVault = new PublicKey("CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq");
      setConnectedWallet(defaultVault);
      router.push("/workspace");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const defaultVault = new PublicKey("CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq");
    setConnectedWallet(defaultVault);
    router.push("/workspace");
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultVault = new PublicKey("CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq");
    setConnectedWallet(defaultVault);
    router.push("/workspace");
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-12 bg-[#0e0f13] text-[#fcfcfc]">
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        
        {/* 5-Dot Constellation Logo Mark (1:1 Proxima) */}
        <div className="proxima-constellation mb-6">
          <div className="constellation-dot dot-top" />
          <div className="constellation-dot dot-bottom" />
          <div className="constellation-dot dot-left" />
          <div className="constellation-dot dot-right" />
          <div className="constellation-dot dot-center" />
        </div>

        {view === "login" && (
          <div className="w-full">
            <h1 className="text-[22px] font-medium text-[#fcfcfc] tracking-tight mb-2.5">
              Log in to Proxima
            </h1>
            <p className="text-[13px] leading-relaxed text-[#8b8e9d] mb-7 max-w-[320px] mx-auto">
              We're migrating license keys to new login methods. If you haven't migrated yet, start migrating now.
            </p>

            {/* Glowing Lavender Action Button */}
            <button
              onClick={handleMigrateLicenseKey}
              disabled={isMigrating}
              className="w-full h-[42px] bg-[#7892ff] hover:bg-[#8fa6ff] text-[#0a0b0e] text-[13.5px] font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(120,146,255,0.25)] hover:shadow-[0_0_24px_rgba(120,146,255,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m21 2-2 2m-1.5 1.5L14 9l-3 3-2-2-5 5a2.83 2.83 0 0 0 4 4l5-5-2-2 3-3 3.5-3.5m0 0L22 4l-2-2z" />
              </svg>
              <span>{isMigrating ? "Migrating key..." : "Migrate my License Key"}</span>
            </button>

            {/* Divider */}
            <div className="w-full flex items-center gap-3 my-5">
              <div className="flex-1 h-[1px] bg-[#1e2029]" />
              <span className="text-[10px] tracking-wider uppercase text-[#565969] font-semibold">
                if already migrated
              </span>
              <div className="flex-1 h-[1px] bg-[#1e2029]" />
            </div>

            {/* Secondary Auth Options */}
            <button
              onClick={() => setView("email")}
              className="w-full h-[42px] bg-[#16171f] hover:bg-[#1d1e28] border border-[#232530] hover:border-[#323545] rounded-lg text-[#fcfcfc] text-[13.5px] font-medium flex items-center justify-center gap-2.5 cursor-pointer transition-all mb-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Continue with Email
            </button>

            <button
              onClick={handleMigrateLicenseKey}
              className="w-full h-[42px] bg-[#16171f] hover:bg-[#1d1e28] border border-[#232530] hover:border-[#323545] rounded-lg text-[#fcfcfc] text-[13.5px] font-medium flex items-center justify-center gap-2.5 cursor-pointer transition-all mb-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Continue with Passkey
            </button>

            <div className="mt-6 text-[12.5px] text-[#8b8e9d]">
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup")}
                className="text-[#7892ff] font-medium hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {view === "signup" && (
          <form onSubmit={handleSignupSubmit} className="w-full text-left space-y-3">
            <h1 className="text-[22px] font-medium text-[#fcfcfc] tracking-tight mb-4 text-center">
              Create an account
            </h1>
            <div>
              <label className="text-[12px] text-[#8b8e9d] block mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (3-24 characters)"
                className="w-full h-[40px] bg-[#14151c] border border-[#232530] focus:border-[#7892ff] rounded-md px-3 text-[#fcfcfc] text-[13px] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[12px] text-[#8b8e9d] block mb-1">Referral code</label>
              <input
                type="text"
                required
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Referral code (required, e.g. Q1WS64)"
                className="w-full h-[40px] bg-[#14151c] border border-[#232530] focus:border-[#7892ff] rounded-md px-3 text-[#fcfcfc] text-[13px] outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full h-[42px] bg-[#7892ff] hover:bg-[#8fa6ff] text-[#0a0b0e] text-[13.5px] font-semibold rounded-lg flex items-center justify-center cursor-pointer transition-all shadow-[0_0_20px_rgba(120,146,255,0.25)] mt-4"
            >
              Create Account
            </button>
            <div className="mt-4 text-[12.5px] text-[#8b8e9d] text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[#7892ff] font-medium hover:underline cursor-pointer"
              >
                Log in
              </button>
            </div>
          </form>
        )}

        {view === "email" && (
          <form onSubmit={handleEmailSubmit} className="w-full text-left space-y-3">
            <h1 className="text-[22px] font-medium text-[#fcfcfc] tracking-tight mb-4 text-center">
              Sign in with Email
            </h1>
            <div>
              <label className="text-[12px] text-[#8b8e9d] block mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full h-[40px] bg-[#14151c] border border-[#232530] focus:border-[#7892ff] rounded-md px-3 text-[#fcfcfc] text-[13px] outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full h-[42px] bg-[#7892ff] hover:bg-[#8fa6ff] text-[#0a0b0e] text-[13.5px] font-semibold rounded-lg flex items-center justify-center cursor-pointer transition-all shadow-[0_0_20px_rgba(120,146,255,0.25)] mt-4"
            >
              Continue
            </button>
            <div className="mt-4 text-[12.5px] text-[#8b8e9d] text-center">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[#7892ff] font-medium hover:underline cursor-pointer"
              >
                ← Back to all options
              </button>
            </div>
          </form>
        )}

        {/* Turnkey Wordmark (1:1 Proxima Badge) */}
        <div className="flex items-center gap-1.5 mt-9 text-[11.5px] text-[#8b8e9d]">
          <span>Secured by</span>
          <span className="font-bold text-[#fcfcfc] tracking-tight">turnkey</span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5 mt-6 text-[#565969]">
          <Link href="/workspace" className="hover:text-[#fcfcfc] transition-colors" title="Workspace Terminal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </Link>
          <a href="https://docs.proxima.tools" target="_blank" rel="noreferrer" className="hover:text-[#fcfcfc] transition-colors" title="Documentation">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#fcfcfc] transition-colors" title="X (Twitter)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
