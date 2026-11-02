import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createBurnInstruction } from "@solana/spl-token";
import { CreatorFeeStrategy } from "../../types";
import { PumpFunAdapter } from "../adapters/pumpFun";

export interface FeeAllocationResult {
  totalHarvestLamports: bigint;
  creatorHarvestSol: number;
  buybackBurnSol: number;
  stableSwapSol: number;
  instructions: TransactionInstruction[];
}

export class FeeBuybackFlywheel {
  /**
   * Calculates fee distribution according to CreatorFeeStrategy
   * and builds on-chain buyback and burn instructions.
   */
  public static planFeeAllocation(params: {
    harvestLamports: bigint;
    strategy: CreatorFeeStrategy;
    creatorPubkey: PublicKey;
    mintPubkey: PublicKey;
    userTokenAccount: PublicKey;
  }): FeeAllocationResult {
    const { harvestLamports, strategy, creatorPubkey, mintPubkey, userTokenAccount } = params;
    const { feeAllocation } = strategy;

    const totalSol = Number(harvestLamports) / 1e9;
    const creatorSol = (totalSol * feeAllocation.creatorSolPercent) / 100;
    const buybackSol = (totalSol * feeAllocation.buybackAndBurnPercent) / 100;
    const stableSwapSol = (totalSol * feeAllocation.stablecoinSwapUsdcPercent) / 100;

    const instructions: TransactionInstruction[] = [];

    // If buyback and burn is active (>0%)
    if (buybackSol > 0) {
      const buybackLamports = BigInt(Math.floor(buybackSol * 1e9));
      const [bondingCurve] = PumpFunAdapter.getBondingCurvePDA(mintPubkey);
      const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
        [bondingCurve.toBuffer(), Buffer.from([6]), mintPubkey.toBuffer()],
        PumpFunAdapter.PROGRAM_ID
      );

      // 1. Buy tokens on curve
      instructions.push(
        PumpFunAdapter.buyInstruction({
          payer: creatorPubkey,
          mint: mintPubkey,
          bondingCurve,
          associatedBondingCurve,
          associatedUserToken: userTokenAccount,
          amountLamports: buybackLamports,
          maxSolCost: buybackLamports * BigInt(2),
        })
      );

      // 2. Burn acquired tokens (approximate token calculation for burn instruction)
      instructions.push(
        createBurnInstruction(
          userTokenAccount,
          mintPubkey,
          creatorPubkey,
          BigInt(1_000_000), // Burn batch tokens
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }

    return {
      totalHarvestLamports: harvestLamports,
      creatorHarvestSol: Number(creatorSol.toFixed(4)),
      buybackBurnSol: Number(buybackSol.toFixed(4)),
      stableSwapSol: Number(stableSwapSol.toFixed(4)),
      instructions,
    };
  }
}
