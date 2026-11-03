import { PublicKey } from "@solana/web3.js";

// ==========================================
// 1. LAUNCHPADS & NETWORKS
// ==========================================
export type SolanaLaunchpad =
  | "PUMP_FUN"
  | "METEORA_DBC"
  | "RAYDIUM_LAUNCHLAB"
  | "BAGS"
  | "LETS_BONK"
  | "STONK_FUN"
  | "PRINTR"
  | "ANONCOIN"
  | "SURGE"
  | "STOXES"
  | "LESGO"
  | "MEME_FUN";

export type BlockchainNetwork =
  | "SOLANA"
  | "BNB_SMART_CHAIN"
  | "ETHEREUM"
  | "BASE"
  | "ROBINHOOD"
  | "ARC"
  | "X_LAYER";

export interface PumpFunSpecificOptions {
  offChainCreate: boolean; // Random public key as on-chain creator; dev signs & pays
  mayhemMode: boolean; // AI trading bot for first 24h
  feeOption: "DEFAULT" | "HOLDER_REWARDS" | "AIRDROP_BUY" | "USE_PAID" | "ZAIO_SPLIT";
  zaioFeeSplitPercent?: number; // e.g. 50/50 split
  holderRewardsAsset?: string;
}

export interface MeteoraDbcOptions {
  configurationKey: string; // Dynamic curve configuration public key
  dynamicFeeBps: number; // 15 to 500 bps (0.15% to 5.0%)
  autoReinvestToDlmm: boolean;
}

export interface RaydiumLaunchLabOptions {
  platformConfigAddress: string;
  customRaiseSol?: number;
  openBookMarketId?: string;
  autoLockLpTokens: boolean;
}

export interface BagsFeeShareRecipient {
  handleOrAddress: string;
  sharePercent: number;
}

// ==========================================
// 2. LAUNCH MODES & MEV SEQUENCING
// ==========================================
export type LaunchMode =
  | "BLOCK_0"
  | "QUICK"
  | "ORGANIC"
  | "MANUAL"
  | "SCHEDULED_SNIPE";

export type BuildPreset = "QUICK_BUILD" | "CLEAN_BUILD" | "FULL_BUILD" | "CUSTOM";

export interface Block0Config {
  preset: BuildPreset;
  frontMevCount: number;
  backMevCount: number;
  backMevTuning: number; // 0 (Less Sniper) to 100 (Less Top Trader)
  tempHolderCount: number;
  holderCount: number;
  frontToBackDelayMs: number;
  mevToTempDelayMs: number;
  holderBuyDelaySeconds: number;
  enableDynamicJitoTip: boolean;
  jitoTipPercentile: "P50" | "P75" | "P90" | "CUSTOM";
  customJitoTipSol: number;
}

// ==========================================
// 3. SNIPER GUARD ENGINE
// ==========================================
export type SniperGuardAction = "NUKE" | "COMPLETE_EARLY";
export type NukeWalletScope = "ALL" | "HOLDERS_ONLY" | "DEV_ONLY";

export interface SniperGuardConfig {
  enabled: boolean;
  triggerExternalBuySol: number; // Threshold in SOL of external buys before triggering
  action: SniperGuardAction;
  nukeScope?: NukeWalletScope;
}

// ==========================================
// 4. WALLET MANAGEMENT & MARKETPLACE
// ==========================================
export type SubWalletRole =
  | "DEPLOYER"
  | "FRONT_MEV"
  | "BACK_MEV"
  | "TEMP_HOLDER"
  | "FINAL_HOLDER"
  | "BUMP_BOT"
  | "TWAP_SELLER";

export interface SubWallet {
  id: string;
  publicKey: string;
  privateKeyEncrypted?: string;
  folderId?: string; // Grouping into folders e.g. "box1", "mev-front"
  balanceSol: number;
  tokenBalance: number;
  role: SubWalletRole;
  allocatedBuySol: number;
  buyDelaySeconds: number;
  status: "IDLE" | "FUNDED" | "EXECUTED" | "HARVESTED";
}

export interface WalletFolder {
  id: string;
  name: string;
  colorHex?: string;
  walletCount: number;
  totalBalanceSol: number;
}

export type WarmedWalletTier = "STANDARD_DEGEN" | "ACTIVE_TRADER" | "GHOST_WHALE";

export interface MarketplaceWalletItem {
  id: string;
  tier: WarmedWalletTier;
  traderPersona: string; // e.g. "Memecoin Degen", "Organic Trader"
  region: "Asia" | "Europe" | "US East" | "US West";
  ageDays: number;
  lifetimeTxCount: number;
  fundingSource: "KuCoin" | "Bitstamp" | "Binance" | "OKX" | "ChangeHero" | "Classic";
  preLoadedBalanceSol: number;
  netFeeSol: number; // Markup charged by SCRAMJET
  totalPriceSol: number; // preLoadedBalanceSol + netFeeSol
  selected: boolean;
}

export interface ActivityGeneratorConfig {
  walletIds: string[];
  amountPerTxMinSol: number;
  amountPerTxMaxSol: number;
  loopCount: number;
  delayBetweenLoopsSeconds: number;
  routingProvider: "DEFAULT" | "AXIOM";
  status: "IDLE" | "RUNNING" | "STOPPED" | "DONE";
}

// ==========================================
// 5. POST-LAUNCH TRADING & AUTOMATION
// ==========================================
export type MultiWalletBuyOrderType = "STAGGER" | "PARALLEL";
export type WalletSelectionStrategy = "ALL" | "RANDOM" | "LOW_TOKENS" | "HIGH_TOKENS";
export type AmountDistributionStrategy = "EQUAL" | "RANDOM_DEVIATION" | "BALANCE_WEIGHTED";

export interface MultiWalletTradeConfig {
  orderType: MultiWalletBuyOrderType;
  slippagePercent: number;
  dispersionPercent: number; // How many wallets participate
  selectionStrategy: WalletSelectionStrategy;
  amountDistribution: AmountDistributionStrategy;
  staggerDelaySeconds?: number;
}

export interface LockSupplyConfig {
  lockProtocol: "STREAMFLOW";
  percentSupplyToLock: number;
  unlockDateTimestamp: number;
  recipientPublicKey: string;
}

export interface BurnSupplyConfig {
  percentDevBalanceToBurn: number;
}

// ==========================================
// 6. SCRAMJET KILLER EXPANSIONS ("AND MORE")
// ==========================================
export interface GhostFunderConfig {
  fundingMode: "CEX_API_DIRECT" | "RELAY_MERKLE_TREE" | "CLASSIC_DISPERSION";
  cexExchange?: "BINANCE" | "OKX" | "BYBIT";
  fundingGapSeconds: number; // Anti-BubbleMaps time spacing (30m, 1h, 12h)
  randomDeviationPercent: number; // Avoids round numbers (e.g. 1.83 SOL vs 2.0 SOL)
}

export interface AlgorithmicMarketMakerConfig {
  enableBumpBot: boolean;
  bumpIntervalSeconds: number;
  bumpMinSol: number;
  bumpMaxSol: number;
  enableGreenCandleTwap: boolean; // Only micro-sells when current candle is green
  twapMaxSellPercentPerSlice: number;
  targetTrendingBoard: "PHOTON" | "PUMP_FUN" | "BULLX" | "DEX_SCREENER";
}

export interface CreatorFeeStrategy {
  harvestIntervalMinutes: number;
  autoHarvest: boolean;
  feeAllocation: {
    creatorSolPercent: number;
    buybackAndBurnPercent: number; // Auto buys on curve and calls spl-token burn
    stablecoinSwapUsdcPercent: number; // Swaps claimed SOL into USDC via Jupiter
    teamSplitWallets?: { address: string; percent: number }[];
  };
}

// ==========================================
// 7. COMPLETE LAUNCH CONFIGURATION
// ==========================================
export interface LaunchConfig {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  imageUrl: string;
  twitterUrl?: string;
  telegramUrl?: string;
  websiteUrl?: string;

  network: BlockchainNetwork;
  launchpad: SolanaLaunchpad;

  pumpFunOptions?: PumpFunSpecificOptions;
  meteoraDbcOptions?: MeteoraDbcOptions;
  raydiumOptions?: RaydiumLaunchLabOptions;
  bagsFeeShare?: BagsFeeShareRecipient[];

  launchMode: LaunchMode;
  block0Config: Block0Config;
  sniperGuard: SniperGuardConfig;
  ghostFunder: GhostFunderConfig;
  marketMaker: AlgorithmicMarketMakerConfig;
  feeStrategy: CreatorFeeStrategy;

  devBuySol: number;
  subWallets: SubWallet[];
}

export interface HarvestRecord {
  timestamp: string;
  tokenMint: string;
  grossHarvestSol: number;
  protocolFeeSol: number; // 3.5% SCRAMJET fee
  netCreatorSol: number;
  buybackBurnSol: number;
  signature: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
}

// ==========================================
// 8. AUTOPILOT "SET & FORGET" & LAUNCH PRESETS
// ==========================================
export type AutopilotRiskProfile = "PROVEN_VOLUME" | "AGGRESSIVE_MOONSHOT" | "STEALTH_ACCUMULATION";

export interface AutopilotEasyLaunchConfig {
  enabled: boolean;
  totalBudgetSol: number;
  riskProfile: AutopilotRiskProfile;
  autoWalletsCount: number;
  discloseBundle: boolean;
  scheduledLaunchTimestamp?: number | null;
}

export interface LaunchTemplate {
  id: string;
  name: string;
  description: string;
  launchpad: SolanaLaunchpad;
  preset: BuildPreset;
  devBuyPercent: number;
  holdersBuyPercent: number;
  holderCount: number;
  backMevTuning: number;
  jitoTipSol: number;
  sniperGuardEnabled: boolean;
  sniperTriggerSol: number;
  buybackBurnPercent: number;
  isOfficial?: boolean;
}

export interface CostBreakdownEstimate {
  baseLaunchFeeSol: number;
  subWalletCoordinationFeeSol: number;
  totalPlatformFeeSol: number;
  devBuySol: number;
  subWalletFundingSol: number;
  accountRentSol: number; // ATA rent per wallet
  jitoBribeSol: number;
  totalSolRequired: number;
  expectedAtaRentRefundSol: number;
}

export interface SubWalletCsvRow {
  address: string;
  allocatedSol: number;
  role?: string;
  label?: string;
}

// ==========================================
// 9. TEAM ROLES, PERMISSIONS & SAFETY
// ==========================================
export type TeamRole = "OWNER" | "OPERATOR" | "VIEWER";

export interface TeamMember {
  id: string;
  address: string;
  name: string;
  role: TeamRole;
  addedAt: string;
}

export interface SpendingLimitConfig {
  enabled: boolean;
  maxSolPerLaunch: number;
  maxDailySol: number;
  currentDailySpentSol: number;
  requireTwoFactorForSells: boolean;
  withdrawalAllowlist: string[];
}

export interface ExportedWalletKeys {
  id: string;
  publicKey: string;
  privateKeyEncrypted: string;
  balanceSol: number;
  role: string;
}

// ==========================================
// 10. CREATOR ANALYTICS, ALERTS & BATCH OPS
// ==========================================
export interface CreatorTokenAnalytics {
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
  launchpad: SolanaLaunchpad;
  launchDate: string;
  holdersCount: number;
  volume24hSol: number;
  marketCapUsd: number;
  totalFeesHarvestedSol: number;
  unclaimedFeesSol: number;
  emptyAtasCount: number;
  reclaimableRentSol: number;
}

export interface NotificationItem {
  id: string;
  type: "LAUNCH_SUCCESS" | "LAUNCH_FAILED" | "RENT_RECLAIMED" | "FEES_AVAILABLE" | "SNIPER_ALERT";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  data?: any;
}

// ==========================================
// 11. DEVELOPER API, WEBHOOKS & CHANGELOG
// ==========================================
export interface WebhookConfig {
  id: string;
  url: string;
  events: ("launch.created" | "launch.executed" | "harvest.claimed" | "sniper.triggered")[];
  secret: string;
  active: boolean;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    category: "New Feature" | "Improvement" | "Security" | "Fix";
    description: string;
  }[];
}

export interface TelemetryState {
  currentSlot: number;
  machVelocity: number;
  totalLaunches: number;
  totalVolumeSol: number;
  totalHarvestedSol: number;
  savedVsProximaSol: number; // 1.5% saved vs Proxima 5.0% fee
  activeWorkers: number;
  activeBumpBots: number;
}

