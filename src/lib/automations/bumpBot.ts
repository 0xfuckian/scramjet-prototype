import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { AlgorithmicMarketMakerConfig, SubWallet } from "../../types";
import { PumpFunAdapter } from "../adapters/pumpFun";

export interface BumpExecutionPlan {
  scheduledBuys: {
    wallet: SubWallet;
    buyAmountSol: number;
    delayMs: number;
  }[];
  totalBudgetSol: number;
}

export class BumpBotEngine {
  /**
   * Plans automated micro-buy jitter from rotating sub-wallets
   * to keep the token at the top of Photon and Pump.fun trending feeds.
   */
  public static planBumpSession(params: {
    config: AlgorithmicMarketMakerConfig;
    availableWallets: SubWallet[];
    sessionDurationMinutes: number;
  }): BumpExecutionPlan {
    const { config, availableWallets, sessionDurationMinutes } = params;
    const totalSlots = Math.floor((sessionDurationMinutes * 60) / config.bumpIntervalSeconds);
    const scheduledBuys: BumpExecutionPlan["scheduledBuys"] = [];

    let totalBudget = 0;
    for (let i = 0; i < totalSlots; i++) {
      const wallet = availableWallets[i % availableWallets.length];
      
      // Randomize bump amount between min and max
      const amount = Number(
        (
          config.bumpMinSol +
          Math.random() * (config.bumpMaxSol - config.bumpMinSol)
        ).toFixed(4)
      );

      scheduledBuys.push({
        wallet,
        buyAmountSol: amount,
        delayMs: i * config.bumpIntervalSeconds * 1000,
      });

      totalBudget += amount;
    }

    return {
      scheduledBuys,
      totalBudgetSol: Number(totalBudget.toFixed(4)),
    };
  }

  /**
   * Builds the single micro-buy instruction for a bump execution
   */
  public static buildBumpInstruction(params: {
    payer: PublicKey;
    mint: PublicKey;
    userTokenAccount: PublicKey;
    amountLamports: bigint;
  }): TransactionInstruction {
    const [bondingCurve] = PumpFunAdapter.getBondingCurvePDA(params.mint);
    const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
      [bondingCurve.toBuffer(), Buffer.from([6]), params.mint.toBuffer()],
      PumpFunAdapter.PROGRAM_ID
    );

    return PumpFunAdapter.buyInstruction({
      payer: params.payer,
      mint: params.mint,
      bondingCurve,
      associatedBondingCurve,
      associatedUserToken: params.userTokenAccount,
      amountLamports: params.amountLamports,
      maxSolCost: params.amountLamports * BigInt(2), // 100% slippage ceiling for micro-bumps
    });
  }
}
