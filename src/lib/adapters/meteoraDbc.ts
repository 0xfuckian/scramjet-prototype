import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { MeteoraDbcOptions } from "../../types";

export class MeteoraDbcAdapter {
  // Official Meteora DBC Program ID on Solana Mainnet
  public static readonly PROGRAM_ID = new PublicKey(
    "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
  );

  /**
   * Derives pool PDA for Meteora Dynamic Curve
   */
  public static getPoolPDA(mintA: PublicKey, mintB: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("dynamic_pool"), mintA.toBuffer(), mintB.toBuffer()],
      this.PROGRAM_ID
    );
  }

  /**
   * Initializes a Dynamic Bonding Curve with custom dynamic fee tiers
   */
  public static initializePoolInstruction(params: {
    creator: PublicKey;
    tokenMint: PublicKey;
    quoteMint: PublicKey; // usually WSOL
    options: MeteoraDbcOptions;
  }): TransactionInstruction {
    const configKey = new PublicKey(params.options.configurationKey);
    const [poolPda] = this.getPoolPDA(params.tokenMint, params.quoteMint);

    const initDiscriminator = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);
    const data = Buffer.alloc(8 + 2 + 1);
    initDiscriminator.copy(data, 0);
    data.writeUInt16LE(params.options.dynamicFeeBps, 8);
    data.writeUInt8(params.options.autoReinvestToDlmm ? 1 : 0, 10);

    return new TransactionInstruction({
      programId: this.PROGRAM_ID,
      keys: [
        { pubkey: poolPda, isSigner: false, isWritable: true },
        { pubkey: configKey, isSigner: false, isWritable: false },
        { pubkey: params.creator, isSigner: true, isWritable: true },
        { pubkey: params.tokenMint, isSigner: false, isWritable: true },
        { pubkey: params.quoteMint, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });
  }
}
