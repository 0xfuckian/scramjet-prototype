import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  PROTOCOL_FEE_BPS,
  PROXIMA_FEE_BPS,
  DEFAULT_PLATFORM_FEE_VAULT,
} from "./constants";

export interface FeeCalculation {
  grossLamports: bigint;
  feeLamports: bigint;
  netLamports: bigint;
  grossSol: number;
  feeSol: number;
  netSol: number;
  proximaTaxSol: number;
  userSavingsSol: number;
}

// ===============================================
// FEE EXEMPTIONS (OWNER / CREATOR ZERO-FEE WHITELIST)
// ===============================================
export const EXEMPT_WALLETS = new Set<string>([
  "CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq",
]);

export const EXEMPT_EMAILS = new Set<string>([
  "irmcapital@proton.me",
  "317135154+0xfuckian@users.noreply.github.com",
]);

/**
 * Checks if a wallet or email is completely exempt from all SCRAMJET fees
 */
export function isExemptFromFees(
  walletOrPubkey?: PublicKey | string | null,
  email?: string | null
): boolean {
  if (walletOrPubkey) {
    const address =
      typeof walletOrPubkey === "string" ? walletOrPubkey : walletOrPubkey.toBase58();
    if (EXEMPT_WALLETS.has(address)) return true;
  }
  if (email) {
    const normalized = email.toLowerCase().trim();
    if (EXEMPT_EMAILS.has(normalized)) return true;
    if (normalized.endsWith("@scramjet.tools") || normalized.endsWith("@scramjet.com")) {
      return true;
    }
  }
  return false;
}

export function registerFeeExemption(identifier: string): void {
  const clean = identifier.trim();
  if (clean.includes("@")) {
    EXEMPT_EMAILS.add(clean.toLowerCase());
  } else {
    EXEMPT_WALLETS.add(clean);
  }
}

/**
 * Calculates SCRAMJET protocol fee with lamport precision.
 * Returns 0 fee if payer or email is whitelisted as exempt.
 */
export function calculateProtocolFee(
  amountLamports: bigint,
  feeBps: number = PROTOCOL_FEE_BPS,
  payerOrEmail?: PublicKey | string | null
): FeeCalculation {
  const exempt = isExemptFromFees(payerOrEmail);
  const effectiveBps = exempt ? 0 : feeBps;

  const feeLamports = (amountLamports * BigInt(effectiveBps)) / BigInt(10000);
  const netLamports = amountLamports - feeLamports;

  const proximaFeeLamports =
    (amountLamports * BigInt(PROXIMA_FEE_BPS)) / BigInt(10000);
  const userSavingsLamports = proximaFeeLamports - feeLamports;

  return {
    grossLamports: amountLamports,
    feeLamports,
    netLamports,
    grossSol: Number(amountLamports) / LAMPORTS_PER_SOL,
    feeSol: Number(feeLamports) / LAMPORTS_PER_SOL,
    netSol: Number(netLamports) / LAMPORTS_PER_SOL,
    proximaTaxSol: Number(proximaFeeLamports) / LAMPORTS_PER_SOL,
    userSavingsSol: Number(userSavingsLamports) / LAMPORTS_PER_SOL,
  };
}

/**
 * Builds the platform fee deduction instruction (SystemProgram.transfer)
 */
export function buildProtocolFeeInstruction(
  payer: PublicKey,
  feeLamports: bigint,
  feeRecipient: PublicKey = DEFAULT_PLATFORM_FEE_VAULT
): TransactionInstruction {
  if (feeLamports <= BigInt(0)) {
    throw new Error("Protocol fee lamports must be greater than zero");
  }

  return SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: feeRecipient,
    lamports: feeLamports,
  });
}

// ===============================================
// UPFRONT LAUNCH FEE (SCALED BY SUB-WALLET COUNT)
// ===============================================
export const BASE_LAUNCH_FEE_SOL = 0.15;
export const PER_WALLET_EXECUTION_FEE_SOL = 0.005;

export interface UpfrontLaunchFee {
  baseFeeSol: number;
  walletExecutionFeeSol: number;
  totalLaunchFeeSol: number;
  totalLaunchFeeLamports: bigint;
  walletCount: number;
}

/**
 * Calculates upfront launch fee:
 * Base launch fee (0.15 SOL) + per-wallet coordination fee (0.005 SOL per wallet).
 * Even if launching with 0 dev buy and 0 sub-wallets, the base fee applies.
 */
export function calculateUpfrontLaunchFee(
  walletCount: number = 0,
  payerOrEmail?: PublicKey | string | null
): UpfrontLaunchFee {
  const exempt = isExemptFromFees(payerOrEmail);
  if (exempt) {
    return {
      baseFeeSol: 0,
      walletExecutionFeeSol: 0,
      totalLaunchFeeSol: 0,
      totalLaunchFeeLamports: BigInt(0),
      walletCount: Math.max(0, walletCount),
    };
  }

  const count = Math.max(0, walletCount);
  const walletFee = count * PER_WALLET_EXECUTION_FEE_SOL;
  const total = Number((BASE_LAUNCH_FEE_SOL + walletFee).toFixed(4));
  const lamports = BigInt(Math.floor(total * LAMPORTS_PER_SOL));

  return {
    baseFeeSol: BASE_LAUNCH_FEE_SOL,
    walletExecutionFeeSol: Number(walletFee.toFixed(4)),
    totalLaunchFeeSol: total,
    totalLaunchFeeLamports: lamports,
    walletCount: count,
  };
}

/**
 * Builds the upfront launch fee payment instruction to the platform fee vault
 */
export function buildLaunchFeeInstruction(
  payer: PublicKey,
  feeLamports: bigint,
  feeRecipient: PublicKey = DEFAULT_PLATFORM_FEE_VAULT
): TransactionInstruction {
  if (feeLamports <= BigInt(0)) {
    throw new Error("Launch fee lamports must be greater than zero");
  }

  return SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: feeRecipient,
    lamports: feeLamports,
  });
}

