import Link from "next/link";

export default function HomePage() {
  const stats = [
    { label: "Active Block Engines", val: "5 Regions", sub: "FRA / AMS / NY / TYO / SLC" },
    { label: "Platform Fee", val: "3.5%", sub: "350 bps (vs Proxima 500 bps)" },
    { label: "Sub-Wallet Minimum", val: "0.01 SOL", sub: "10x lower than Proxima" },
    { label: "ATA Rent Recovery", val: "+0.00204 SOL", sub: "Auto-recycled per wallet" },
  ];

  const features = [
    {
      title: "12 Solana Launchpads Supported",
      desc: "Full parity with Pump.fun, Meteora DBC dynamic curves, Raydium LaunchLab, Bags fee-sharing, LetsBonk, and StonkFun.",
      href: "/launch",
      badge: "Full Parity",
    },
    {
      title: "P2P-Scale Warmed Marketplace",
      desc: "Aged wallets with genuine multi-DEX transaction counts, CEX funding provenance, and anti-BubbleMap spacing.",
      href: "/marketplace",
      badge: "Higher Margin",
    },
    {
      title: "Live Workspace & Instant Trade HUD",
      desc: "Space-bar hotkey panel, parallel multi-wallet orders, Streamflow token locking, and Dev supply burns.",
      href: "/workspace",
      badge: "Real-time",
    },
    {
      title: "Algorithmic Market Maker & Bumping Bot",
      desc: "Micro-buy jitter to dominate trending boards on Photon/Pump, plus green-candle TWAP exit defense.",
      href: "/workspace",
      badge: "SCRAMJET Exclusive",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs text-scram-plasma bg-scram-plasma/10 border border-scram-plasma/30 px-3 py-1 rounded-full">
          <span>MACH CASCADE ENGINE INITIALIZED</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-scram-stark font-mono uppercase">
          Hypersonic Solana Launchpad & MEV Orchestrator
        </h1>
        <p className="text-scram-titanium text-sm max-w-2xl leading-relaxed">
          Engineered to outperform legacy launch tools. Zero-cluster Ghost Funder, Jito Block-0 atomic
          coordination, 0.01 SOL micro-funding, and automated creator fee buyback loops.
        </p>

        <div className="flex items-center space-x-4 pt-4">
          <Link
            href="/launch"
            className="bg-scram-plasma hover:bg-scram-flare text-black font-bold px-6 py-2.5 rounded text-xs tracking-wider uppercase transition-all shadow-plasma"
          >
            Create New Launch →
          </Link>
          <Link
            href="/marketplace"
            className="border border-scram-border hover:border-scram-plasma px-6 py-2.5 rounded text-xs tracking-wider uppercase text-scram-stark transition-all"
          >
            Warmed Wallet Shop
          </Link>
        </div>
      </div>

      {/* Real-Time Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-scram-surface border border-scram-border p-4 rounded space-y-1">
            <div className="text-[11px] text-scram-titanium uppercase">{s.label}</div>
            <div className="text-xl font-bold text-scram-stark">{s.val}</div>
            <div className="text-[10px] text-scram-plasma font-mono">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Feature Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, idx) => (
          <Link
            key={idx}
            href={f.href}
            className="bg-scram-card hover:bg-scram-hover border border-scram-border hover:border-scram-plasma/50 p-6 rounded transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-scram-stark group-hover:text-scram-plasma transition-colors">
                {f.title}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-scram-surface border border-scram-border text-scram-plasma">
                {f.badge}
              </span>
            </div>
            <p className="text-xs text-scram-titanium leading-relaxed">{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
