import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { RaydiumLaunchLabOptions } from "../../types";

export class RaydiumLaunchLabAdapter {
  // Raydium LaunchLab / CPMM Program ID
  public static readonly PROGRAM_ID = new PublicKey(
    "CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"
  );

  /**
   * Derives Raydium CPMM Pool Authority PDA
   */
  public static getPoolAuthority(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault_and_lp_mint_auth_seed")],
      this.PROGRAM_ID
    );
  }

  /**
   * Initializes LaunchLab pool under a platform config
   */
  public static initializeLaunchLabPoolInstruction(params: {
    creator: PublicKey;
    tokenMint: PublicKey;
    quoteMint: PublicKey;
    options: RaydiumLaunchLabOptions;
  }): TransactionInstruction {
    const platformConfig = new PublicKey(params.options.platformConfigAddress);
    const [auth] = this.getPoolAuthority();

    const discriminator = Buffer.from([143, 37, 222, 96, 160, 102, 171, 62]);
    const data = Buffer.alloc(8 + 1);
    discriminator.copy(data, 0);
    data.writeUInt8(params.options.autoLockLpTokens ? 1 : 0, 8);

    return new TransactionInstruction({
      programId: this.PROGRAM_ID,
      keys: [
        { pubkey: params.creator, isSigner: true, isWritable: true },
        { pubkey: platformConfig, isSigner: false, isWritable: false },
        { pubkey: auth, isSigner: false, isWritable: false },
        { pubkey: params.tokenMint, isSigner: false, isWritable: false },
        { pubkey: params.quoteMint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });
  }
}
