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

/**
 * Calculates SCRAMJET 3.5% protocol fee with lamport precision
 * and benchmarks user savings vs Proxima's 5.0% fee.
 */
export function calculateProtocolFee(
  amountLamports: bigint,
  feeBps: number = PROTOCOL_FEE_BPS
): FeeCalculation {
  const feeLamports = (amountLamports * BigInt(feeBps)) / BigInt(10000);
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
export function calculateUpfrontLaunchFee(walletCount: number = 0): UpfrontLaunchFee {
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

