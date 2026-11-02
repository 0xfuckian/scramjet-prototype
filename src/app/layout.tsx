import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCRAMJET // Hypersonic Launchpad & Creator Fee Protocol",
  description: "Next-gen Solana Token Launchpad, MEV Bundle Orchestrator & Warmed Wallet Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-scram-void text-scram-stark min-h-screen flex flex-col font-mono selection:bg-scram-plasma selection:text-white">
        {/* Hypersonic Top HUD Bar */}
        <header className="border-b border-scram-border bg-scram-surface/80 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-6 h-6 rounded bg-scram-plasma flex items-center justify-center font-bold text-black text-xs group-hover:shadow-plasma transition-all">
                SJ
              </div>
              <span className="font-bold text-sm tracking-widest text-scram-stark group-hover:text-scram-plasma transition-colors">
                SCRAMJET <span className="text-[10px] text-scram-titanium font-normal">MACH 3.5</span>
              </span>
            </Link>

            <nav className="flex items-center space-x-1 text-xs">
              <Link
                href="/launch"
                className="px-3 py-1.5 rounded hover:bg-scram-card hover:text-scram-plasma transition-colors"
              >
                Launch
              </Link>
              <Link
                href="/workspace"
                className="px-3 py-1.5 rounded hover:bg-scram-card hover:text-scram-plasma transition-colors"
              >
                Workspace
              </Link>
              <Link
                href="/marketplace"
                className="px-3 py-1.5 rounded hover:bg-scram-card hover:text-scram-plasma transition-colors flex items-center space-x-1"
              >
                <span>Marketplace</span>
                <span className="text-[9px] bg-scram-plasma/20 text-scram-plasma px-1 rounded font-semibold">
                  NEW
                </span>
              </Link>
              <Link
                href="/funder"
                className="px-3 py-1.5 rounded hover:bg-scram-card hover:text-scram-plasma transition-colors"
              >
                Funder
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 bg-scram-card px-2.5 py-1 rounded border border-scram-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-scram-titanium text-[11px]">SOL $93.85</span>
            </div>
            <div className="flex items-center space-x-2 bg-scram-plasma/10 border border-scram-plasma/30 px-3 py-1 rounded text-scram-plasma text-xs font-semibold">
              <span>Platform Fee: 3.5%</span>
              <span className="text-[10px] text-emerald-400 font-mono">(-30% vs Proxima)</span>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-scram-border py-4 px-6 text-center text-xs text-scram-titanium flex justify-between items-center bg-scram-surface">
          <div>SCRAMJET v1.0.0-PROXIMA-KILLER // JITO BLOCK-0 ENGINE</div>
          <div className="flex space-x-4">
            <span>5 Block Engines Online</span>
            <span>Ghost Funder Ready</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
