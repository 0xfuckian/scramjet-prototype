import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { CreatorTokenAnalytics, SolanaLaunchpad } from "../../types";
import { RentReclaimer } from "../wallets/rentReclaim";

export class CreatorAnalyticsIndexer {
  /**
   * Aggregates on-chain metrics across all tokens launched or imported by the creator.
   */
  public static summarizePortfolio(tokens: CreatorTokenAnalytics[]): {
    totalTokens: number;
    totalHolders: number;
    total24hVolumeSol: number;
    totalHarvestedSol: number;
    totalUnclaimedSol: number;
    totalReclaimableRentSol: number;
  } {
    return tokens.reduce(
      (acc, t) => ({
        totalTokens: acc.totalTokens + 1,
        totalHolders: acc.totalHolders + t.holdersCount,
        total24hVolumeSol: Number((acc.total24hVolumeSol + t.volume24hSol).toFixed(3)),
        totalHarvestedSol: Number((acc.totalHarvestedSol + t.totalFeesHarvestedSol).toFixed(3)),
        totalUnclaimedSol: Number((acc.totalUnclaimedSol + t.unclaimedFeesSol).toFixed(3)),
        totalReclaimableRentSol: Number((acc.totalReclaimableRentSol + t.reclaimableRentSol).toFixed(4)),
      }),
      {
        totalTokens: 0,
        totalHolders: 0,
        total24hVolumeSol: 0,
        totalHarvestedSol: 0,
        totalUnclaimedSol: 0,
        totalReclaimableRentSol: 0,
      }
    );
  }

  /**
   * Builds batch instructions to close empty ATAs across all creator tokens in 1 click.
   */
  public static buildMultiTokenRentReclaim(params: {
    destinationMaster: PublicKey;
    tokenMints: { mintPubkey: PublicKey; emptyAtas: PublicKey[]; owner: PublicKey }[];
  }): TransactionInstruction[] {
    const allInstructions: TransactionInstruction[] = [];

    for (const group of params.tokenMints) {
      const accounts = group.emptyAtas.map((ata) => ({
        accountPubkey: ata,
        walletOwnerPubkey: group.owner,
      }));
      const batch = RentReclaimer.buildBatchReclaimInstructions({
        destinationMaster: params.destinationMaster,
        tokenAccounts: accounts,
      });
      allInstructions.push(...batch.instructions);
    }

    return allInstructions;
  }
}
