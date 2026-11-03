import type { Metadata } from "next";
import Link from "next/link";
import { WalletButton } from "../components/wallet/WalletButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCRAMJET // Hypersonic Multi-Chain Launchpad & MEV Orchestrator",
  description: "One platform. Every token operation. Powered by Scramjet Hypersonic Engine & Turnkey MPC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090C] text-[#F8FAFC] min-h-screen flex flex-col font-sans selection:bg-[#FF3E00]/30 selection:text-white">
        
        {/* Top SCRAMJET Navigation Header */}
        <header className="sticky top-0 z-50 h-[48px] px-4 bg-[#08090C]/95 backdrop-blur border-b border-[#1C2533] flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="scramjet-mark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="font-bold text-[13.5px] tracking-tight text-[#F8FAFC] group-hover:text-[#FF3E00] transition-colors flex items-center gap-1.5">
                <span>SCRAMJET</span>
                <span className="text-[10px] text-[#FF3E00] font-mono px-1.5 py-0.2 bg-[#FF3E00]/10 border border-[#FF3E00]/30 rounded">
                  MACH 3.5
                </span>
              </span>
            </Link>

            <nav className="flex items-center gap-1 text-[12px] font-medium text-[#8E9AA8]">
              <Link
                href="/workspace"
                className="px-2.5 py-1 rounded hover:text-[#F8FAFC] hover:bg-[#121721] transition-colors"
              >
                Workspace
              </Link>
              <Link
                href="/launch"
                className="px-2.5 py-1 rounded hover:text-[#F8FAFC] hover:bg-[#121721] transition-colors"
              >
                Launch
              </Link>
              <Link
                href="/marketplace"
                className="px-2.5 py-1 rounded hover:text-[#F8FAFC] hover:bg-[#121721] transition-colors flex items-center gap-1.5"
              >
                <span>Marketplace</span>
                <span className="text-[9px] bg-[#FF3E00]/20 text-[#FF3E00] px-1 py-0.2 rounded font-semibold">
                  NEW
                </span>
              </Link>
              <Link
                href="/funder"
                className="px-2.5 py-1 rounded hover:text-[#F8FAFC] hover:bg-[#121721] transition-colors"
              >
                Funder
              </Link>
              <Link
                href="/login"
                className="px-2.5 py-1 rounded text-[#FF3E00] hover:bg-[#FF3E00]/10 transition-colors font-semibold"
              >
                Auth
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0D1117] px-2.5 py-1 rounded border border-[#1C2533] text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#31E3AC] animate-pulse" />
              <span className="text-[#8E9AA8]">SOL $93.85</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FF3E00]/10 border border-[#FF3E00]/30 px-2.5 py-1 rounded text-[11px] font-mono text-[#FF3E00]">
              <span>Fee: 3.5%</span>
            </div>
            <WalletButton />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* SCRAMJET Bottom Status Bar */}
        <footer className="h-[32px] px-4 border-t border-[#1C2533] bg-[#08090C] text-[11px] text-[#8E9AA8] flex items-center justify-between font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#31E3AC]" />
              <span>All Services Live · 365ms</span>
            </span>
            <span>Fee: 3.5% (Scramjet Engine)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>5 Jito Block Engines Online</span>
            <span>Turnkey Enclave Active</span>
          </div>
        </footer>
      </body>
    </html>
  );
}


