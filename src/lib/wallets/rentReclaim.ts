import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createCloseAccountInstruction } from "@solana/spl-token";

export interface RentReclaimBatch {
  instructions: TransactionInstruction[];
  totalReclaimedSol: number;
  walletCount: number;
}

export class RentReclaimer {
  // Rent for a standard Solana Token Account (ATA) is ~0.00203928 SOL
  public static readonly ATA_RENT_SOL = 0.00203928;

  /**
   * Generates batch instructions to close empty Associated Token Accounts across sub-wallets,
   * sweeping the recovered rent back to the master destination address.
   */
  public static buildBatchReclaimInstructions(params: {
    destinationMaster: PublicKey;
    tokenAccounts: {
      accountPubkey: PublicKey;
      walletOwnerPubkey: PublicKey;
    }[];
  }): RentReclaimBatch {
    const { destinationMaster, tokenAccounts } = params;

    const instructions: TransactionInstruction[] = tokenAccounts.map((item) =>
      createCloseAccountInstruction(
        item.accountPubkey,
        destinationMaster,
        item.walletOwnerPubkey,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const totalReclaimedSol = Number(
      (tokenAccounts.length * this.ATA_RENT_SOL).toFixed(5)
    );

    return {
      instructions,
      totalReclaimedSol,
      walletCount: tokenAccounts.length,
    };
  }
}
