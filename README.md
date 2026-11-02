# SCRAMJET // Mach Cascade

> Hypersonic Solana Token Launchpad, MEV Bundle Orchestrator & Automated Creator Fee Protocol.

SCRAMJET is an all-in-one launch ecosystem designed to surpass legacy launchpads like Proxima. It features Jito Block-0 atomic bundling, multi-venue deployment (12 Solana launchpads including Meteora DBC and Pump.fun), an in-house Warmed Wallet Marketplace, zero-cluster Ghost Funder, 0.01 SOL micro-funding, and automated creator fee buyback flywheels.

---

## ⚡ Key Architectural Advantages vs Proxima

| Feature | Proxima Baseline | SCRAMJET Advantage |
| :--- | :--- | :--- |
| **Platform Fee** | Flat 5.0% (500 bps) | **3.5% (350 bps)** — 30% user fee savings, scaling to 0% with $SCRAM |
| **Sub-Wallet Minimum** | 0.10 SOL (~$9.50) lockup | **0.01 SOL (~$0.95)** — 10x lower capital barrier for multi-wallet bundles |
| **Rent Recovery** | Lost / Burned ATA rent | **Automated ATA Reclaim** — Recycles ~0.00204 SOL per wallet post-sale |
| **Funder Footprint** | Single parent wallet cluster | **Ghost Funder** — Direct CEX API auto-withdrawals & Merkle relay dispersion |
| **Marketplace Quality** | 1-tx fresh wallets sold at 180% markup | **Aged Tiering** (1–50+ multi-DEX txs, KuCoin/OKX provenance, funding gaps) |
| **Post-Launch AMM** | Manual trades only | **Photon Bump Bot & Green-Candle TWAP** built directly into the Live HUD |
| **Fee Utility** | Passive SOL extraction only | **Automated Buyback & Burn** directly on the active bonding curve |

---

## 📁 Repository Structure

```
scramjet/
├── src/
│   ├── app/                    # Next.js 15 Hypersonic HUD
│   │   ├── launch/             # 12-venue launchpad wizard & Block-0 builder
│   │   ├── workspace/          # Live Workspace HUD, Instant Trade panel & DexScreener chart
│   │   ├── marketplace/        # Warmed Wallet Shop with Persona & CEX filters
│   │   ├── funder/             # Folder manager, Ghost Funder & ATA Rent Reclaimer
│   │   ├── layout.tsx          # Master cyber HUD layout
│   │   └── page.tsx            # Launchpad terminal home
│   ├── components/             # Reusable UI components
│   │   └── workspace/          # TradingChart.tsx & trade marker overlay
│   ├── lib/
│   │   ├── adapters/           # On-chain launchpad adapters (PumpFun, Meteora DBC, Raydium)
│   │   ├── automations/        # BumpBot, GreenCandleTwap, SniperGuard, FeeBuyback
│   │   ├── jito/               # JitoClient (5 global block engines) & BundleBuilder (Block-0)
│   │   ├── pipeline/           # LaunchOrchestrator master pipeline
│   │   ├── wallets/            # TurnkeyManager (MPC enclaves), GhostFunder, RentReclaimer
│   │   ├── constants.ts        # Program IDs, Jito tip accounts, Fee constants
│   │   └── feeRouter.ts        # 350 bps protocol fee calculator & instruction builder
│   └── types/
│       └── index.ts            # Complete strongly-typed domain model
```

---

## 🚀 Environment Configuration

Add the following keys to your local configuration:

```bash
# 1. Solana RPC & WebSocket (Helius / Triton / QuickNode)
NEXT_PUBLIC_SOLANA_RPC_URL="https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"
NEXT_PUBLIC_SOLANA_WS_URL="wss://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"
NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"

# 2. Turnkey Non-Custodial Enclave Configuration
TURNKEY_ORGANIZATION_ID="your-turnkey-org-id"
TURNKEY_API_PUBLIC_KEY="your-turnkey-api-public-key"
TURNKEY_API_PRIVATE_KEY="your-turnkey-api-private-key"
TURNKEY_BASE_URL="https://api.turnkey.com"

# 3. SCRAMJET Protocol Fee Vault
NEXT_PUBLIC_SCRAMJET_FEE_VAULT="77CaVVomNEpWBsD5cQ678yi5vQYc6mp7ipvSD9JLMF3L"
```

---

## 🛠️ Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Compile optimized production build
npm run build
```

---

## 🛡️ License
Private & Proprietary. All rights reserved.
