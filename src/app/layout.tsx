import type { Metadata } from "next";
import Link from "next/link";
import { WalletButton } from "../components/wallet/WalletButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proxima Tools // Multi-Chain Launchpad & Automated Operations",
  description: "One platform. Every token operation. Powered by Scramjet Hypersonic Engine & Turnkey MPC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0e0f13] text-[#fcfcfc] min-h-screen flex flex-col font-sans selection:bg-[#7892ff]/30 selection:text-white">
        
        {/* Top 1:1 Navigation Header */}
        <header className="sticky top-0 z-50 h-[48px] px-4 bg-[#0e0f13]/95 backdrop-blur border-b border-[#22242f] flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="proxima-constellation transform scale-[0.75]">
                <div className="constellation-dot dot-top" />
                <div className="constellation-dot dot-bottom" />
                <div className="constellation-dot dot-left" />
                <div className="constellation-dot dot-right" />
                <div className="constellation-dot dot-center" />
              </div>
              <span className="font-bold text-[13.5px] tracking-tight text-[#fcfcfc] group-hover:text-[#7892ff] transition-colors">
                PROXIMA
              </span>
            </Link>

            <nav className="flex items-center gap-1 text-[12px] font-medium text-[#8b8e9d]">
              <Link
                href="/workspace"
                className="px-2.5 py-1 rounded hover:text-[#fcfcfc] hover:bg-[#1a1b24] transition-colors"
              >
                Workspace
              </Link>
              <Link
                href="/launch"
                className="px-2.5 py-1 rounded hover:text-[#fcfcfc] hover:bg-[#1a1b24] transition-colors"
              >
                Launch
              </Link>
              <Link
                href="/marketplace"
                className="px-2.5 py-1 rounded hover:text-[#fcfcfc] hover:bg-[#1a1b24] transition-colors flex items-center gap-1.5"
              >
                <span>Marketplace</span>
                <span className="text-[9px] bg-[#7892ff]/20 text-[#7892ff] px-1 py-0.2 rounded font-semibold">
                  NEW
                </span>
              </Link>
              <Link
                href="/funder"
                className="px-2.5 py-1 rounded hover:text-[#fcfcfc] hover:bg-[#1a1b24] transition-colors"
              >
                Funder
              </Link>
              <Link
                href="/login"
                className="px-2.5 py-1 rounded text-[#7892ff] hover:bg-[#7892ff]/10 transition-colors"
              >
                Auth
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#16171f] px-2.5 py-1 rounded border border-[#22242f] text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#31e3ac] animate-pulse" />
              <span className="text-[#8b8e9d]">SOL $93.85</span>
            </div>
            <WalletButton />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Proxima Bottom Status Bar */}
        <footer className="h-[32px] px-4 border-t border-[#22242f] bg-[#0e0f13] text-[11px] text-[#8b8e9d] flex items-center justify-between font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#31e3ac]" />
              <span>All Services Live · 365ms</span>
            </span>
            <span>Fee: 3.5% (Scramjet Engine)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>5 Jito Engines Connected</span>
            <span>Turnkey MPC Active</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

