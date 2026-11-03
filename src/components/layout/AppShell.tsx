"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "../wallet/WalletButton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // ================= 1. PUBLIC MARKETING HOMEPAGE LAYOUT (https://proxima.tools 1:1) =================
  if (isLanding) {
    return (
      <div className="min-h-screen bg-[#07080B] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF3E00]/30 selection:text-white">
        {/* Top Marketing Header */}
        <header className="sticky top-0 z-50 h-[56px] px-6 md:px-12 bg-[#07080B]/90 backdrop-blur-md border-b border-[#14161F] flex items-center justify-between text-xs">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="scramjet-mark transform scale-90">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-[#F8FAFC] group-hover:text-[#FF3E00] transition-colors">
              SCRAMJET
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] text-[#8E9AA8]">
            <Link href="#product" className="hover:text-[#F8FAFC] transition-colors">
              Product
            </Link>
            <Link href="#changelog" className="hover:text-[#F8FAFC] transition-colors">
              Changelog
            </Link>
            <Link href="#docs" className="hover:text-[#F8FAFC] transition-colors">
              Read the docs
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/workspace"
              className="h-[34px] px-5 rounded-full bg-[#F8FAFC] hover:bg-[#FFFFFF] text-[#07080B] font-bold text-xs tracking-tight flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Open SCRAMJET
            </Link>
          </div>
        </header>

        {/* Marketing Page Content */}
        <main className="flex-1">{children}</main>

        {/* Marketing Footer (1:1 Proxima Screenshot) */}
        <footer className="border-t border-[#14161F] bg-[#07080B] px-6 md:px-16 py-16 text-xs text-[#636879]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="scramjet-mark transform scale-90">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="font-bold text-sm tracking-tight text-[#F8FAFC]">
                  SCRAMJET
                </span>
              </div>
              <p className="text-[12px] text-[#636879] max-w-xs leading-relaxed">
                Hypersonic Solana token launchpad, Block-0 MEV orchestrator &amp; automated creator fee engine.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-12 text-[12px]">
              <div className="space-y-3">
                <span className="font-semibold text-[#F8FAFC]">Product</span>
                <ul className="space-y-2">
                  <li><Link href="/workspace" className="hover:text-[#F8FAFC]">Platform</Link></li>
                  <li><Link href="/launch" className="hover:text-[#F8FAFC]">Launchpads</Link></li>
                  <li><Link href="/workspace" className="hover:text-[#F8FAFC]">Coverage</Link></li>
                  <li><Link href="/workspace" className="hover:text-[#F8FAFC]">Activity</Link></li>
                  <li><Link href="#changelog" className="hover:text-[#F8FAFC]">Changelog</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-semibold text-[#F8FAFC]">Learn</span>
                <ul className="space-y-2">
                  <li><a href="https://docs.proxima.tools" target="_blank" rel="noreferrer" className="hover:text-[#F8FAFC]">Documentation</a></li>
                  <li><a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#F8FAFC]">X / Twitter</a></li>
                  <li><a href="https://t.me" target="_blank" rel="noreferrer" className="hover:text-[#F8FAFC]">Telegram</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-semibold text-[#F8FAFC]">Legal</span>
                <ul className="space-y-2">
                  <li><span className="hover:text-[#F8FAFC] cursor-pointer">Terms of Service</span></li>
                  <li><span className="hover:text-[#F8FAFC] cursor-pointer">Privacy Policy</span></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ================= 2. IN-APP TERMINAL LAYOUT (Sidebar + Top Bar + Bottom Ticker) =================
  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF3E00]/30 selection:text-white overflow-hidden">
      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-32px)]">
        {/* Left Persistent Sidebar (1:1 Proxima) */}
        <aside className="w-[210px] border-r border-[#1C202B] bg-[#0B0C10] flex flex-col justify-between flex-shrink-0 z-40 select-none">
          <div className="p-3 space-y-4">
            {/* Header: Brand & Version */}
            <div className="flex items-center justify-between px-1">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="scramjet-mark transform scale-90">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="font-bold text-xs tracking-tight text-[#F8FAFC] group-hover:text-[#FF3E00] transition-colors">
                  SCRAMJET <span className="text-[10px] text-[#636879] font-normal font-mono">v1.0</span>
                </span>
              </Link>
              <button className="text-[#636879] hover:text-[#F8FAFC] p-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
                </svg>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <div className="h-8 bg-[#111218] border border-[#1C202B] rounded-md px-2.5 flex items-center justify-between text-xs text-[#636879] hover:border-[#2D3344] cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="text-[11px]">Search</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#161720] border border-[#22242F]">⌘K</span>
                </div>
              </div>
            </div>

            {/* Navigation Items (Features) */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#4E5364] px-2 font-semibold tracking-wider">
                Features
              </div>
              
              <Link
                href="/workspace"
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  pathname === "/workspace"
                    ? "bg-[#161722] text-[#F8FAFC] font-semibold"
                    : "text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#14161E]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
                <span>My Wallets</span>
              </Link>

              <Link
                href="/marketplace"
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  pathname === "/marketplace"
                    ? "bg-[#161722] text-[#F8FAFC] font-semibold"
                    : "text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#14161E]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>Marketplace</span>
                </div>
                <span className="text-[8px] font-bold font-mono px-1.5 py-0.2 rounded bg-[#FF3E00]/20 text-[#FF3E00] border border-[#FF3E00]/30">
                  NEW
                </span>
              </Link>

              <Link
                href="/workspace"
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#14161E] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
                </svg>
                <span>Tracker</span>
              </Link>

              <Link
                href="/launch"
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#14161E] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
                </svg>
                <span>Archived</span>
              </Link>

              <Link
                href="/"
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#14161E] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Dashboard</span>
              </Link>

              <Link
                href="/marketplace"
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#14161E] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                <span>Rewards</span>
              </Link>

              {/* Funder Section */}
              <Link
                href="/funder"
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors mt-2 ${
                  pathname === "/funder"
                    ? "bg-[#161722] text-[#F8FAFC] font-semibold"
                    : "text-[#8E9AA8] hover:text-[#F8FAFC] hover:bg-[#14161E]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span>Funder</span>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bottom Action Buttons in Sidebar */}
          <div className="p-3 border-t border-[#1C202B] space-y-2">
            <div className="flex gap-2">
              <Link
                href="/launch"
                className="flex-1 h-8 rounded-md border border-[#1C202B] bg-[#111218] hover:bg-[#14161E] text-[#8E9AA8] hover:text-[#F8FAFC] text-[11px] font-medium flex items-center justify-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Import</span>
              </Link>
              <Link
                href="/launch"
                className="flex-1 h-8 rounded-md bg-[#FF3E00] hover:bg-[#FF5500] text-black text-[11px] font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(255,62,0,0.3)] transition-all"
              >
                <span>+ Launch</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Main Content Stage */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#08090C]">
          {/* Top Minimal Strip with WalletButton */}
          <div className="h-[44px] px-6 border-b border-[#1C202B] flex items-center justify-between text-xs bg-[#08090C]/90 backdrop-blur z-20 sticky top-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#636879]">NETWORK:</span>
              <span className="font-mono text-[11px] text-[#31E3AC]">SOLANA MAINNET</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#0D1117] px-2.5 py-1 rounded border border-[#1C2533] text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#31E3AC] animate-pulse" />
                <span className="text-[#8E9AA8]">SOL $92.31</span>
              </div>
              <WalletButton />
            </div>
          </div>

          {/* View Body */}
          <main className="flex-1">{children}</main>
        </div>
      </div>

      {/* 1:1 Proxima Bottom Floating Status Bar */}
      <footer className="h-[32px] px-4 border-t border-[#1C202B] bg-[#07080B] text-[11px] text-[#636879] flex items-center justify-between font-mono z-50 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#31E3AC]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#31E3AC] animate-pulse" />
            <span>All Services are Live · 396ms</span>
          </span>
          <span className="text-[#8E9AA8] hover:text-[#F8FAFC] cursor-pointer">Help</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-[#8E9AA8]">Market Overview</span>
          <span className="text-[#F8FAFC] font-semibold">$92.31 ↗</span>
          <span className="text-[#F8FAFC] font-semibold">$697 ↗</span>
          <span className="text-[#FF2A55] font-semibold">$2,266 ↘</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#F8FAFC]">X</a>
          <span className="hover:text-[#F8FAFC] cursor-pointer">News</span>
          <a href="https://docs.proxima.tools" target="_blank" rel="noreferrer" className="hover:text-[#F8FAFC]">Documentation</a>
          <span className="hover:text-[#F8FAFC] cursor-pointer">Activity</span>
          <span className="hover:text-[#F8FAFC] cursor-pointer">Settings</span>
        </div>
      </footer>
    </div>
  );
}
