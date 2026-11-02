import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { GhostFunderConfig, SubWallet } from "../../types";

export interface DispersalPlan {
  masterPayer: PublicKey;
  totalSolRequired: number;
  relays: {
    relayKeypair: Keypair;
    targetWallets: SubWallet[];
    relayFundingSol: number;
  }[];
  instructions: TransactionInstruction[];
}

export class GhostFunder {
  /**
   * Plans multi-hop relay dispersion to prevent single-parent clustering on BubbleMaps.
   * Splits N sub-wallets across intermediate relay accounts with randomized timing and non-round amounts.
   */
  public static planGhostDispersal(params: {
    masterPayer: PublicKey;
    subWallets: SubWallet[];
    config: GhostFunderConfig;
  }): DispersalPlan {
    const { masterPayer, subWallets, config } = params;
    const RELAYS_COUNT = Math.max(2, Math.ceil(subWallets.length / 5));
    const relays: DispersalPlan["relays"] = [];

    for (let r = 0; r < RELAYS_COUNT; r++) {
      relays.push({
        relayKeypair: Keypair.generate(),
        targetWallets: [],
        relayFundingSol: 0,
      });
    }

    // Distribute sub-wallets across relays with randomized jitter
    let totalSolRequired = 0;
    subWallets.forEach((wallet, idx) => {
      const relay = relays[idx % RELAYS_COUNT];
      
      // Calculate randomized jitter (e.g. ±5%) to avoid round number detection
      const jitterFactor = 1 + (Math.random() * 2 - 1) * (config.randomDeviationPercent / 100);
      const allocatedSol = Number((wallet.allocatedBuySol * jitterFactor).toFixed(4));

      relay.targetWallets.push({
        ...wallet,
        allocatedBuySol: allocatedSol,
      });

      // Include base rent buffer (0.01 SOL)
      relay.relayFundingSol += allocatedSol + 0.01;
      totalSolRequired += allocatedSol + 0.01;
    });

    // Generate Level 1 Instructions: Master Payer -> Relays
    const instructions: TransactionInstruction[] = relays.map((r) =>
      SystemProgram.transfer({
        fromPubkey: masterPayer,
        toPubkey: r.relayKeypair.publicKey,
        lamports: BigInt(Math.floor(r.relayFundingSol * 1e9)),
      })
    );

    return {
      masterPayer,
      totalSolRequired: Number(totalSolRequired.toFixed(4)),
      relays,
      instructions,
    };
  }
}
