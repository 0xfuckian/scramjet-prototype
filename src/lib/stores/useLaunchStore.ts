import { create } from "zustand";
import bs58 from "bs58";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createCloseAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import type {
  AlgorithmicMarketMakerConfig,
  LaunchConfig,
  MultiWalletTradeConfig,
  SniperGuardConfig,
  SubWallet,
  WalletFolder,
} from "../../types";
import { PumpFunAdapter } from "../adapters/pumpFun";
import { BumpBotEngine } from "../automations/bumpBot";
import { GreenCandleTwapEngine } from "../automations/greenTwap";
import { SniperGuardEngine } from "../automations/sniperGuard";
import { buildProtocolFeeInstruction, calculateProtocolFee } from "../feeRouter";
import {
  getLatestBlockhash,
  getSolBalance,
  getTokenBalance,
  monitorTransactionConfirmation,
  toPublicKey,
  watchSlotChanges,
  withSolanaRpc,
} from "../solana/connection";
import { RentReclaimer } from "../wallets/rentReclaim";

export interface BumpBotAutomationStatus {
  enabled: boolean;
  running: boolean;
  intervalSeconds: number;
  bumpsPlanned: number;
  bumpsExecuted: number;
  totalBudgetSol: number;
  lastSignature: string | null;
  lastError: string | null;
  mint: string | null;
}

export interface GreenTwapAutomationStatus {
  enabled: boolean;
  running: boolean;
  maxSellPercentPerSlice: number;
  slicesReady: number;
  lastError: string | null;
}

export interface SniperGuardAutomationStatus {
  enabled: boolean;
  lastAction: "NUKE" | "COMPLETE_EARLY" | "NONE";
  lastExternalBuySol: number;
  lastError: string | null;
}

export interface ActiveAutomations {
  bumpBot: BumpBotAutomationStatus;
  greenTwap: GreenTwapAutomationStatus;
  sniperGuard: SniperGuardAutomationStatus;
}

export interface ChainActionResult {
  ok: boolean;
  signatures: string[];
  error: string | null;
  /** True when the transaction was simulated because no signer was available. */
  simulated: boolean;
}

export interface BumpBotResult {
  running: boolean;
  plannedBumps: number;
  totalBudgetSol: number;
  error: string | null;
}

export interface AtaRentReclaimResult extends ChainActionResult {
  totalReclaimedSol: number;
  walletCount: number;
  skipped: { walletId: string; reason: string }[];
}

export interface LaunchStore {
  connectedWallet: PublicKey | null;
  masterBalanceSol: number;
  activeLaunchConfig: LaunchConfig;
  subWallets: SubWallet[];
  folders: WalletFolder[];
  folderLabels: Record<string, string>;
  currentSlot: number;
  activeAutomations: ActiveAutomations;
  reclaimedRentSol: number;
  lastActionMessage: string | null;
  pendingAction: string | null;

  setConnectedWallet: (pubkey: PublicKey | null) => Promise<void>;
  updateLaunchConfig: (partialConfig: Partial<LaunchConfig>) => void;
  addWalletsToFolder: (folderId: string, wallets: SubWallet[]) => Promise<void>;
  triggerBumpBot: (
    mintPubkey: PublicKey | string,
    config: AlgorithmicMarketMakerConfig
  ) => Promise<BumpBotResult>;
  executeMultiWalletTrade: (
    tradeConfig: MultiWalletTradeConfig,
    tokenMint: PublicKey | string,
    side?: "BUY" | "SELL"
  ) => Promise<ChainActionResult>;
  executeAtaRentReclaim: (destinationPubkey: PublicKey | string) => Promise<AtaRentReclaimResult>;
  startSlotFeed: () => void;
  refreshWalletBalances: (tokenMint?: PublicKey | string) => Promise<void>;
}

const FOLDER_LABELS: Record<string, string> = {
  box1: "box1 (Active Launch)",
  "mev-front": "mev-front (Block-0)",
  holders: "holders (Long Term)",
};

const SEED_WALLETS: SubWallet[] = [
  {
    id: "w-1",
    publicKey: "B6953qWrWQrcP8oFhw9a4P1E7FaUxa6wjUAfU2kShkMn",
    folderId: "box1",
    role: "DEPLOYER",
    balanceSol: 4.82,
    tokenBalance: 150_000_000,
    allocatedBuySol: 2.5,
    buyDelaySeconds: 0,
    status: "EXECUTED",
  },
  {
    id: "w-2",
    publicKey: "BDRnahTF38Wt4MXD4yNnbssPj5iW4S18mFuor9DNYuCy",
    folderId: "mev-front",
    role: "FRONT_MEV",
    balanceSol: 0.85,
    tokenBalance: 42_000_000,
    allocatedBuySol: 1,
    buyDelaySeconds: 0,
    status: "EXECUTED",
  },
  {
    id: "w-3",
    publicKey: "HoJVV2ADhdRVHgzcMq6WakG4WG7qrF57UAV1H4sGZhfZ",
    folderId: "mev-front",
    role: "FRONT_MEV",
    balanceSol: 0.92,
    tokenBalance: 39_000_000,
    allocatedBuySol: 1,
    buyDelaySeconds: 0,
    status: "EXECUTED",
  },
  {
    id: "w-4",
    publicKey: "J4DATAqYFTmmpJDkS5cS5TyAMjGoEt5SQPLmAsC2wUEa",
    folderId: "box1",
    role: "BACK_MEV",
    balanceSol: 0.44,
    tokenBalance: 21_000_000,
    allocatedBuySol: 0.5,
    buyDelaySeconds: 2,
    status: "EXECUTED",
  },
  {
    id: "w-5",
    publicKey: "G12Yhev9V8EfffCN33qLX5iBULc3z1QPjV2Tj7GEyfP8",
    folderId: "holders",
    role: "FINAL_HOLDER",
    balanceSol: 0.12,
    tokenBalance: 12_500_000,
    allocatedBuySol: 0.25,
    buyDelaySeconds: 5,
    status: "EXECUTED",
  },
];

function defaultLaunchConfig(subWallets: SubWallet[]): LaunchConfig {
  return {
    tokenName: "SCRAM",
    tokenSymbol: "SCRAM",
    tokenDescription:
      "SCRAMJET Protocol Utility Token - Powering hypersonic launches on Solana.",
    imageUrl: "",
    network: "SOLANA",
    launchpad: "PUMP_FUN",
    launchMode: "BLOCK_0",
    block0Config: {
      preset: "CLEAN_BUILD",
      frontMevCount: 2,
      backMevCount: 1,
      backMevTuning: 40,
      tempHolderCount: 0,
      holderCount: 1,
      frontToBackDelayMs: 0,
      mevToTempDelayMs: 0,
      holderBuyDelaySeconds: 5,
      enableDynamicJitoTip: true,
      jitoTipPercentile: "P75",
      customJitoTipSol: 0.015,
    },
    sniperGuard: {
      enabled: true,
      triggerExternalBuySol: 5,
      action: "NUKE",
      nukeScope: "HOLDERS_ONLY",
    },
    ghostFunder: {
      fundingMode: "RELAY_MERKLE_TREE",
      cexExchange: "OKX",
      fundingGapSeconds: 30 * 60,
      randomDeviationPercent: 5,
    },
    marketMaker: {
      enableBumpBot: false,
      bumpIntervalSeconds: 15,
      bumpMinSol: 0.01,
      bumpMaxSol: 0.05,
      enableGreenCandleTwap: false,
      twapMaxSellPercentPerSlice: 10,
      targetTrendingBoard: "PHOTON",
    },
    feeStrategy: {
      harvestIntervalMinutes: 30,
      autoHarvest: false,
      feeAllocation: {
        creatorSolPercent: 50,
        buybackAndBurnPercent: 50,
        stablecoinSwapUsdcPercent: 0,
      },
    },
    devBuySol: 2.5,
    subWallets,
  };
}

function emptyAutomations(config: LaunchConfig): ActiveAutomations {
  return {
    bumpBot: {
      enabled: config.marketMaker.enableBumpBot,
      running: false,
      intervalSeconds: config.marketMaker.bumpIntervalSeconds,
      bumpsPlanned: 0,
      bumpsExecuted: 0,
      totalBudgetSol: 0,
      lastSignature: null,
      lastError: null,
      mint: null,
    },
    greenTwap: {
      enabled: config.marketMaker.enableGreenCandleTwap,
      running: false,
      maxSellPercentPerSlice: config.marketMaker.twapMaxSellPercentPerSlice,
      slicesReady: 0,
      lastError: null,
    },
    sniperGuard: {
      enabled: config.sniperGuard.enabled,
      lastAction: "NONE",
      lastExternalBuySol: 0,
      lastError: null,
    },
  };
}

function deriveFolders(wallets: SubWallet[], labels: Record<string, string>): WalletFolder[] {
  const ids = new Set<string>(Object.keys(labels));
  for (const wallet of wallets) {
    if (wallet.folderId) ids.add(wallet.folderId);
  }

  return [...ids].map((id) => {
    const members = wallets.filter((wallet) => wallet.folderId === id);
    const total = members.reduce((sum, wallet) => sum + wallet.balanceSol, 0);
    return {
      id,
      name: labels[id] ?? id,
      walletCount: members.length,
      totalBalanceSol: Number(total.toFixed(4)),
    };
  });
}

function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function keypairFromWallet(wallet: SubWallet): Keypair | null {
  if (!wallet.privateKeyEncrypted) return null;
  try {
    const secret = bs58.decode(wallet.privateKeyEncrypted);
    if (secret.length !== 64) return null;
    const keypair = Keypair.fromSecretKey(secret);
    return keypair.publicKey.toBase58() === wallet.publicKey ? keypair : null;
  } catch {
    return null;
  }
}

function syncGreenTwap(
  config: AlgorithmicMarketMakerConfig,
  wallets: SubWallet[]
): GreenTwapAutomationStatus {
  if (!config.enableGreenCandleTwap) {
    return {
      enabled: false,
      running: false,
      maxSellPercentPerSlice: config.twapMaxSellPercentPerSlice,
      slicesReady: 0,
      lastError: null,
    };
  }

  const slices = GreenCandleTwapEngine.planNextSlice({
    wallets,
    maxSellPercentPerSlice: config.twapMaxSellPercentPerSlice,
    currentPriceSol: 1,
    candleOpenPriceSol: 1,
  });
  const slicesReady = slices.filter((slice) => slice.conditionMet).length;

  return {
    enabled: true,
    running: true,
    maxSellPercentPerSlice: config.twapMaxSellPercentPerSlice,
    slicesReady,
    lastError: wallets.length === 0 ? "No sub-wallets available for TWAP" : null,
  };
}

function syncSniper(config: SniperGuardConfig, wallets: SubWallet[]): SniperGuardAutomationStatus {
  const devWallet = wallets.find((wallet) => wallet.role === "DEPLOYER");
  if (!devWallet) {
    return {
      enabled: config.enabled,
      lastAction: "NONE",
      lastExternalBuySol: 0,
      lastError: wallets.length === 0 ? null : "No deployer wallet for sniper guard",
    };
  }

  const evaluation = SniperGuardEngine.evaluateDefense({
    config,
    externalBuyVolumeSol: 0,
    subWallets: wallets.filter((wallet) => wallet.id !== devWallet.id),
    devWallet,
  });

  return {
    enabled: config.enabled,
    lastAction: evaluation.action,
    lastExternalBuySol: evaluation.externalBuyVolumeSol,
    lastError: null,
  };
}

function selectTradeWallets(wallets: SubWallet[], config: MultiWalletTradeConfig): SubWallet[] {
  if (wallets.length === 0 || config.dispersionPercent <= 0) return [];

  const fraction = Math.min(100, config.dispersionPercent) / 100;
  const take =
    config.selectionStrategy === "ALL"
      ? wallets.length
      : Math.min(wallets.length, Math.max(1, Math.ceil(wallets.length * fraction)));

  const ordered = [...wallets];
  if (config.selectionStrategy === "RANDOM") {
    ordered.sort(() => Math.random() - 0.5);
  } else if (config.selectionStrategy === "LOW_TOKENS") {
    ordered.sort((a, b) => a.tokenBalance - b.tokenBalance);
  } else if (config.selectionStrategy === "HIGH_TOKENS") {
    ordered.sort((a, b) => b.tokenBalance - a.tokenBalance);
  }

  return ordered.slice(0, take);
}

function distributeBuyAmounts(wallets: SubWallet[], config: MultiWalletTradeConfig): number[] {
  const base = wallets.map((wallet) => wallet.allocatedBuySol);
  if (config.amountDistribution === "EQUAL") {
    const average = base.reduce((sum, amount) => sum + amount, 0) / wallets.length;
    return wallets.map(() => average);
  }
  if (config.amountDistribution === "RANDOM_DEVIATION") {
    return base.map((amount) => Number((amount * (0.85 + Math.random() * 0.3)).toFixed(4)));
  }

  const balanceTotal = wallets.reduce((sum, wallet) => sum + wallet.balanceSol, 0);
  const allocatedTotal = base.reduce((sum, amount) => sum + amount, 0);
  if (balanceTotal <= 0) return base;
  return wallets.map((wallet) =>
    Number(((allocatedTotal * wallet.balanceSol) / balanceTotal).toFixed(4))
  );
}

function associatedBondingCurve(mint: PublicKey, bondingCurve: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [bondingCurve.toBuffer(), Buffer.from([6]), mint.toBuffer()],
    PumpFunAdapter.PROGRAM_ID
  )[0];
}

function buildPumpSellInstruction(params: {
  payer: PublicKey;
  mint: PublicKey;
  bondingCurve: PublicKey;
  associatedBondingCurve: PublicKey;
  associatedUserToken: PublicKey;
  tokenAmount: bigint;
  minSolOutput: bigint;
}): TransactionInstruction {
  const sellDiscriminator = Buffer.from([51, 230, 133, 164, 1, 127, 131, 173]);
  const data = Buffer.alloc(24);
  sellDiscriminator.copy(data, 0);
  data.writeBigUInt64LE(params.tokenAmount, 8);
  data.writeBigUInt64LE(params.minSolOutput, 16);

  return new TransactionInstruction({
    programId: PumpFunAdapter.PROGRAM_ID,
    keys: [
      { pubkey: PumpFunAdapter.getGlobalPDA()[0], isSigner: false, isWritable: false },
      { pubkey: PumpFunAdapter.FEE_RECIPIENT, isSigner: false, isWritable: true },
      { pubkey: params.mint, isSigner: false, isWritable: false },
      { pubkey: params.bondingCurve, isSigner: false, isWritable: true },
      { pubkey: params.associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: params.associatedUserToken, isSigner: false, isWritable: true },
      { pubkey: params.payer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

async function simulateInstructions(
  feePayer: PublicKey,
  instructions: TransactionInstruction[]
): Promise<{ ok: boolean; err: string | null }> {
  if (instructions.length === 0) {
    return { ok: false, err: "No instructions to simulate" };
  }

  const { blockhash } = await getLatestBlockhash();
  const message = new TransactionMessage({
    payerKey: feePayer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  const response = await withSolanaRpc((connection) =>
    connection.simulateTransaction(transaction, {
      sigVerify: false,
      replaceRecentBlockhash: true,
      commitment: "confirmed",
    })
  );

  return {
    ok: response.value.err == null,
    err: response.value.err ? JSON.stringify(response.value.err) : null,
  };
}

async function sendSignedInstructions(
  feePayer: Keypair,
  instructions: TransactionInstruction[],
  extraSigners: Keypair[] = []
): Promise<string> {
  const { blockhash } = await getLatestBlockhash();
  const message = new TransactionMessage({
    payerKey: feePayer.publicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  transaction.sign([feePayer, ...extraSigners]);

  const signature = await withSolanaRpc((connection) =>
    connection.sendTransaction(transaction, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
      maxRetries: 3,
    })
  );
  const confirmation = await monitorTransactionConfirmation(signature);
  if (!confirmation.confirmed) {
    throw new Error(confirmation.err ?? `Transaction ${signature} was not confirmed`);
  }
  return signature;
}

function readParsedTokenAmount(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") return null;
  const info = (parsed as { info?: { tokenAmount?: { amount?: unknown } } }).info;
  const amount = info?.tokenAmount?.amount;
  return typeof amount === "string" ? amount : null;
}

let stopSlotFeed: (() => void) | null = null;
let bumpTimer: ReturnType<typeof setInterval> | null = null;
let bumpCursor = 0;

function clearBumpTimer(): void {
  if (bumpTimer) {
    clearInterval(bumpTimer);
    bumpTimer = null;
  }
}

const initialConfig = defaultLaunchConfig(SEED_WALLETS);

export const useLaunchStore = create<LaunchStore>((set, get) => ({
  connectedWallet: null,
  masterBalanceSol: 0,
  activeLaunchConfig: initialConfig,
  subWallets: SEED_WALLETS,
  folders: deriveFolders(SEED_WALLETS, FOLDER_LABELS),
  folderLabels: FOLDER_LABELS,
  currentSlot: 0,
  activeAutomations: emptyAutomations(initialConfig),
  reclaimedRentSol: 0,
  lastActionMessage: null,
  pendingAction: null,

  startSlotFeed: () => {
    if (stopSlotFeed) return;
    stopSlotFeed = watchSlotChanges((slot) => {
      set({ currentSlot: slot });
    });
    void withSolanaRpc((connection) => connection.getSlot("confirmed"))
      .then((slot) => set({ currentSlot: slot }))
      .catch((error: unknown) => {
        set({ lastActionMessage: toMessage(error) });
      });
  },

  refreshWalletBalances: async (tokenMint) => {
    const mint = tokenMint ? toPublicKey(tokenMint) : null;
    const refreshed = await Promise.all(
      get().subWallets.map(async (wallet) => {
        try {
          const owner = toPublicKey(wallet.publicKey);
          const balanceSol = await getSolBalance(owner);
          let tokenBalance = wallet.tokenBalance;
          if (mint) {
            const ata = getAssociatedTokenAddressSync(mint, owner, true);
            tokenBalance = await getTokenBalance(ata);
          }
          return { ...wallet, balanceSol, tokenBalance };
        } catch {
          return wallet;
        }
      })
    );

    let masterBalanceSol = get().masterBalanceSol;
    const connectedWallet = get().connectedWallet;
    if (connectedWallet) {
      try {
        masterBalanceSol = await getSolBalance(connectedWallet);
      } catch (error) {
        set({ lastActionMessage: toMessage(error) });
      }
    }

    set({
      subWallets: refreshed,
      masterBalanceSol,
      folders: deriveFolders(refreshed, get().folderLabels),
      activeLaunchConfig: { ...get().activeLaunchConfig, subWallets: refreshed },
    });
  },

  setConnectedWallet: async (pubkey) => {
    if (!pubkey) {
      set({ connectedWallet: null, masterBalanceSol: 0 });
      return;
    }

    set({ connectedWallet: pubkey, pendingAction: "connect-wallet" });
    try {
      const masterBalanceSol = await getSolBalance(pubkey);
      set({
        masterBalanceSol,
        lastActionMessage: `Master wallet ${pubkey.toBase58()} holds ${masterBalanceSol.toFixed(4)} SOL`,
        pendingAction: null,
      });
    } catch (error) {
      set({
        lastActionMessage: toMessage(error),
        pendingAction: null,
      });
    }
  },

  updateLaunchConfig: (partialConfig) => {
    const current = get().activeLaunchConfig;
    const subWallets = partialConfig.subWallets ?? get().subWallets;
    const nextConfig: LaunchConfig = {
      ...current,
      ...partialConfig,
      subWallets,
    };
    let activeAutomations = get().activeAutomations;

    if (partialConfig.marketMaker) {
      activeAutomations = {
        ...activeAutomations,
        bumpBot: {
          ...activeAutomations.bumpBot,
          enabled: partialConfig.marketMaker.enableBumpBot,
          intervalSeconds: partialConfig.marketMaker.bumpIntervalSeconds,
        },
        greenTwap: syncGreenTwap(partialConfig.marketMaker, subWallets),
      };
    }

    if (partialConfig.sniperGuard) {
      activeAutomations = {
        ...activeAutomations,
        sniperGuard: syncSniper(partialConfig.sniperGuard, subWallets),
      };
    }

    set({
      activeLaunchConfig: nextConfig,
      subWallets,
      folders: deriveFolders(subWallets, get().folderLabels),
      activeAutomations,
    });
  },

  addWalletsToFolder: async (folderId, wallets) => {
    set({ pendingAction: "add-wallets" });
    try {
      const labels = {
        ...get().folderLabels,
        [folderId]: get().folderLabels[folderId] ?? `Folder ${folderId}`,
      };
      const tagged = wallets.map((wallet) => ({ ...wallet, folderId }));
      const merged = new Map(get().subWallets.map((wallet) => [wallet.id, wallet]));
      for (const wallet of tagged) merged.set(wallet.id, wallet);

      const withBalances = await Promise.all(
        [...merged.values()].map(async (wallet) => {
          if (!tagged.some((entry) => entry.id === wallet.id)) return wallet;
          try {
            const balanceSol = await getSolBalance(wallet.publicKey);
            return {
              ...wallet,
              balanceSol,
              status: wallet.status === "IDLE" ? ("FUNDED" as const) : wallet.status,
            };
          } catch {
            return wallet;
          }
        })
      );

      set({
        folderLabels: labels,
        subWallets: withBalances,
        folders: deriveFolders(withBalances, labels),
        activeLaunchConfig: { ...get().activeLaunchConfig, subWallets: withBalances },
        pendingAction: null,
        lastActionMessage:
          tagged.length === 0
            ? `Registered folder ${labels[folderId]}`
            : `Updated ${tagged.length} wallet${tagged.length === 1 ? "" : "s"} in ${labels[folderId]}`,
      });
    } catch (error) {
      set({ pendingAction: null, lastActionMessage: toMessage(error) });
      throw error;
    }
  },

  triggerBumpBot: async (mintPubkey, config) => {
    clearBumpTimer();
    bumpCursor = 0;

    const nextMarketMaker = { ...get().activeLaunchConfig.marketMaker, ...config };
    if (!config.enableBumpBot) {
      set({
        activeLaunchConfig: { ...get().activeLaunchConfig, marketMaker: nextMarketMaker },
        activeAutomations: {
          ...get().activeAutomations,
          bumpBot: {
            ...get().activeAutomations.bumpBot,
            enabled: false,
            running: false,
            lastError: null,
          },
        },
        lastActionMessage: "Bump bot stopped",
      });
      return { running: false, plannedBumps: 0, totalBudgetSol: 0, error: null };
    }

    let mint: PublicKey;
    try {
      mint = toPublicKey(mintPubkey);
    } catch (error) {
      const message = toMessage(error);
      set({ lastActionMessage: message });
      return { running: false, plannedBumps: 0, totalBudgetSol: 0, error: message };
    }

    const bumpWallets = get().subWallets.filter((wallet) => wallet.role === "BUMP_BOT");
    const availableWallets = bumpWallets.length > 0 ? bumpWallets : get().subWallets;
    if (availableWallets.length === 0) {
      const message = "No sub-wallets available for the bump bot";
      set({ lastActionMessage: message });
      return { running: false, plannedBumps: 0, totalBudgetSol: 0, error: message };
    }

    const plan = BumpBotEngine.planBumpSession({
      config: nextMarketMaker,
      availableWallets,
      sessionDurationMinutes: 10,
    });

    const runSlice = async (wallet: SubWallet, buyAmountSol: number) => {
      const payer = toPublicKey(wallet.publicKey);
      const userTokenAccount = getAssociatedTokenAddressSync(mint, payer, true);
      const amountLamports = BigInt(Math.max(1, Math.floor(buyAmountSol * LAMPORTS_PER_SOL)));
      const instructions = [
        createAssociatedTokenAccountIdempotentInstruction(payer, userTokenAccount, payer, mint),
        BumpBotEngine.buildBumpInstruction({
          payer,
          mint,
          userTokenAccount,
          amountLamports,
        }),
      ];

      const signer = keypairFromWallet(wallet);
      if (signer) {
        const signature = await sendSignedInstructions(signer, instructions);
        set({
          activeAutomations: {
            ...get().activeAutomations,
            bumpBot: {
              ...get().activeAutomations.bumpBot,
              bumpsExecuted: get().activeAutomations.bumpBot.bumpsExecuted + 1,
              lastSignature: signature,
              lastError: null,
            },
          },
        });
        return;
      }

      const simulation = await simulateInstructions(payer, instructions);
      const lastError = simulation.ok
        ? "Bump instruction simulated. Sub-wallet signer required to broadcast."
        : `Bump simulation failed: ${simulation.err ?? "unknown error"}`;
      set({
        activeAutomations: {
          ...get().activeAutomations,
          bumpBot: {
            ...get().activeAutomations.bumpBot,
            bumpsExecuted: get().activeAutomations.bumpBot.bumpsExecuted + 1,
            lastError,
          },
        },
        lastActionMessage: lastError,
      });
    };

    set({
      activeLaunchConfig: { ...get().activeLaunchConfig, marketMaker: nextMarketMaker },
      activeAutomations: {
        ...get().activeAutomations,
        bumpBot: {
          enabled: true,
          running: true,
          intervalSeconds: nextMarketMaker.bumpIntervalSeconds,
          bumpsPlanned: plan.scheduledBuys.length,
          bumpsExecuted: 0,
          totalBudgetSol: plan.totalBudgetSol,
          lastSignature: null,
          lastError: null,
          mint: mint.toBase58(),
        },
      },
      lastActionMessage: `Bump bot armed for ${plan.scheduledBuys.length} slices (${plan.totalBudgetSol} SOL)`,
    });

    const tick = async () => {
      const slice = plan.scheduledBuys[bumpCursor % plan.scheduledBuys.length];
      bumpCursor += 1;
      if (!slice) return;
      try {
        await runSlice(slice.wallet, slice.buyAmountSol);
      } catch (error) {
        const message = toMessage(error);
        set({
          activeAutomations: {
            ...get().activeAutomations,
            bumpBot: { ...get().activeAutomations.bumpBot, lastError: message },
          },
          lastActionMessage: message,
        });
      }
    };

    await tick();
    bumpTimer = setInterval(() => {
      void tick();
    }, Math.max(1, nextMarketMaker.bumpIntervalSeconds) * 1000);

    return {
      running: true,
      plannedBumps: plan.scheduledBuys.length,
      totalBudgetSol: plan.totalBudgetSol,
      error: get().activeAutomations.bumpBot.lastError,
    };
  },

  executeMultiWalletTrade: async (tradeConfig, tokenMint, side = "BUY") => {
    set({ pendingAction: "multi-wallet-trade" });
    try {
      const mint = toPublicKey(tokenMint);
      const launchpad = get().activeLaunchConfig.launchpad;
      await get().refreshWalletBalances(mint);

      const selected = selectTradeWallets(get().subWallets, tradeConfig);
      if (selected.length === 0) {
        const error = "No sub-wallets selected for this trade";
        set({ pendingAction: null, lastActionMessage: error });
        return { ok: false, signatures: [], error, simulated: false };
      }

      if (launchpad !== "PUMP_FUN") {
        const error = `${launchpad} adapter has no buy or sell instruction. Balances were refreshed from chain.`;
        set({ pendingAction: null, lastActionMessage: error });
        return { ok: false, signatures: [], error, simulated: false };
      }

      const buyAmounts = distributeBuyAmounts(selected, tradeConfig);
      const signatures: string[] = [];
      const errors: string[] = [];
      let simulated = false;
      const [bondingCurve] = PumpFunAdapter.getBondingCurvePDA(mint);
      const curveAta = associatedBondingCurve(mint, bondingCurve);

      for (let index = 0; index < selected.length; index += 1) {
        const wallet = selected[index];
        const payer = toPublicKey(wallet.publicKey);
        const userAta = getAssociatedTokenAddressSync(mint, payer, true);
        const instructions: TransactionInstruction[] = [
          createAssociatedTokenAccountIdempotentInstruction(payer, userAta, payer, mint),
        ];

        if (side === "BUY") {
          const sol = buyAmounts[index] ?? 0;
          if (sol <= 0) {
            errors.push(`${wallet.id}: buy amount is zero`);
            continue;
          }
          const lamports = BigInt(Math.floor(sol * LAMPORTS_PER_SOL));
          const slippage = BigInt(Math.max(0, Math.round(tradeConfig.slippagePercent)));
          const maxSolCost = (lamports * (100n + slippage)) / 100n;
          instructions.push(
            PumpFunAdapter.buyInstruction({
              payer,
              mint,
              bondingCurve,
              associatedBondingCurve: curveAta,
              associatedUserToken: userAta,
              amountLamports: lamports,
              maxSolCost,
            })
          );
          const fee = calculateProtocolFee(lamports);
          if (fee.feeLamports > 0n) {
            instructions.push(buildProtocolFeeInstruction(payer, fee.feeLamports));
          }
        } else {
          const tokenAmount = BigInt(Math.floor(wallet.tokenBalance));
          if (tokenAmount <= 0n) {
            errors.push(`${wallet.id}: token balance is zero`);
            continue;
          }
          instructions.push(
            buildPumpSellInstruction({
              payer,
              mint,
              bondingCurve,
              associatedBondingCurve: curveAta,
              associatedUserToken: userAta,
              tokenAmount,
              minSolOutput: 0n,
            })
          );
        }

        try {
          const signer = keypairFromWallet(wallet);
          if (signer) {
            const signature = await sendSignedInstructions(signer, instructions);
            signatures.push(signature);
            const balanceSol = await getSolBalance(payer);
            const tokenBalance = await getTokenBalance(userAta);
            const subWallets = get().subWallets.map((entry) =>
              entry.id === wallet.id
                ? { ...entry, balanceSol, tokenBalance, status: "EXECUTED" as const }
                : entry
            );
            set({
              subWallets,
              folders: deriveFolders(subWallets, get().folderLabels),
              activeLaunchConfig: { ...get().activeLaunchConfig, subWallets },
            });
          } else {
            simulated = true;
            const simulation = await simulateInstructions(payer, instructions);
            if (!simulation.ok) {
              errors.push(`${wallet.id}: simulation failed: ${simulation.err ?? "unknown error"}`);
            } else {
              errors.push(`${wallet.id}: simulated. Signer required to broadcast.`);
            }
          }
        } catch (error) {
          errors.push(`${wallet.id}: ${toMessage(error)}`);
        }

        if (tradeConfig.orderType === "STAGGER" && index < selected.length - 1) {
          await delay(Math.max(0, tradeConfig.staggerDelaySeconds ?? 0) * 1000);
        }
      }

      const confirmed = signatures.length > 0 && errors.length === 0;
      const error = errors.length > 0 ? errors.join(" ") : null;
      const message = confirmed
        ? `Confirmed ${signatures.length} ${side.toLowerCase()} transaction${signatures.length === 1 ? "" : "s"}`
        : error ?? "Trade did not produce a signature";
      set({ pendingAction: null, lastActionMessage: message });
      return { ok: confirmed, signatures, error, simulated };
    } catch (error) {
      const message = toMessage(error);
      set({ pendingAction: null, lastActionMessage: message });
      return { ok: false, signatures: [], error: message, simulated: false };
    }
  },

  executeAtaRentReclaim: async (destinationPubkey) => {
    set({ pendingAction: "reclaim-rent" });
    const skipped: AtaRentReclaimResult["skipped"] = [];

    try {
      const destination = toPublicKey(destinationPubkey);
      const emptyClassic: { accountPubkey: PublicKey; walletOwnerPubkey: PublicKey }[] = [];
      const emptyToken2022: { accountPubkey: PublicKey; walletOwnerPubkey: PublicKey }[] = [];

      for (const wallet of get().subWallets) {
        let owner: PublicKey;
        try {
          owner = toPublicKey(wallet.publicKey);
        } catch {
          skipped.push({ walletId: wallet.id, reason: "Invalid public key" });
          continue;
        }

        const [classicAccounts, token2022Accounts] = await Promise.all([
          withSolanaRpc((connection) =>
            connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID }, "confirmed")
          ),
          withSolanaRpc((connection) =>
            connection.getParsedTokenAccountsByOwner(
              owner,
              { programId: TOKEN_2022_PROGRAM_ID },
              "confirmed"
            )
          ),
        ]);

        const groups = [
          { response: classicAccounts, bucket: emptyClassic },
          { response: token2022Accounts, bucket: emptyToken2022 },
        ];
        let sawAccount = false;
        for (const group of groups) {
          for (const entry of group.response.value) {
            sawAccount = true;
            const amount = readParsedTokenAmount(entry.account.data.parsed);
            if (amount === "0") {
              group.bucket.push({
                accountPubkey: entry.pubkey,
                walletOwnerPubkey: owner,
              });
            } else {
              skipped.push({ walletId: wallet.id, reason: "ATA still holds tokens" });
            }
          }
        }
        if (!sawAccount) {
          skipped.push({ walletId: wallet.id, reason: "No token accounts" });
        }
      }

      const classicBatch = RentReclaimer.buildBatchReclaimInstructions({
        destinationMaster: destination,
        tokenAccounts: emptyClassic,
      });
      const token2022Instructions = emptyToken2022.map((account) =>
        createCloseAccountInstruction(
          account.accountPubkey,
          destination,
          account.walletOwnerPubkey,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      const instructions = [...classicBatch.instructions, ...token2022Instructions];
      const estimatedSol = Number(
        (classicBatch.totalReclaimedSol + token2022Instructions.length * RentReclaimer.ATA_RENT_SOL).toFixed(5)
      );

      if (instructions.length === 0) {
        const error = "No empty ATAs to reclaim";
        set({ pendingAction: null, lastActionMessage: error });
        return {
          ok: false,
          signatures: [],
          error,
          simulated: false,
          totalReclaimedSol: 0,
          walletCount: 0,
          skipped,
        };
      }

      const ownerSigners = [...emptyClassic, ...emptyToken2022]
        .map((account) =>
          get().subWallets.find((wallet) => wallet.publicKey === account.walletOwnerPubkey.toBase58())
        )
        .filter((wallet): wallet is SubWallet => Boolean(wallet))
        .map((wallet) => keypairFromWallet(wallet))
        .filter((keypair): keypair is Keypair => keypair !== null);
      const destinationWallet = get().subWallets.find(
        (wallet) => wallet.publicKey === destination.toBase58()
      );
      const feePayer = destinationWallet ? keypairFromWallet(destinationWallet) : null;
      const uniqueOwners = new Set(
        [...emptyClassic, ...emptyToken2022].map((account) => account.walletOwnerPubkey.toBase58())
      );

      if (feePayer && ownerSigners.length === uniqueOwners.size) {
        const signature = await sendSignedInstructions(feePayer, instructions, ownerSigners);
        const reclaimedRentSol = Number((get().reclaimedRentSol + estimatedSol).toFixed(5));
        set({
          reclaimedRentSol,
          pendingAction: null,
          lastActionMessage: `Reclaimed ~${estimatedSol} SOL (${signature})`,
        });
        await get().refreshWalletBalances();
        return {
          ok: true,
          signatures: [signature],
          error: null,
          simulated: false,
          totalReclaimedSol: estimatedSol,
          walletCount: uniqueOwners.size,
          skipped,
        };
      }

      const simulation = await simulateInstructions(destination, instructions.slice(0, 8));
      const error = simulation.ok
        ? `Built ${instructions.length} close instructions (~${estimatedSol} SOL). Simulation succeeded. Owner signers are required to broadcast.`
        : `Built ${instructions.length} close instructions. Simulation failed: ${simulation.err ?? "unknown error"}`;
      set({ pendingAction: null, lastActionMessage: error });
      return {
        ok: false,
        signatures: [],
        error,
        simulated: true,
        totalReclaimedSol: 0,
        walletCount: uniqueOwners.size,
        skipped,
      };
    } catch (error) {
      const message = toMessage(error);
      set({ pendingAction: null, lastActionMessage: message });
      return {
        ok: false,
        signatures: [],
        error: message,
        simulated: false,
        totalReclaimedSol: 0,
        walletCount: 0,
        skipped,
      };
    }
  },
}));
