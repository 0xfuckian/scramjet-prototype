import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { PUMP_FUN_PROGRAM_ID, PUMP_FEE_RECIPIENT } from "../constants";

export interface PumpBondingCurveAccounts {
  bondingCurve: PublicKey;
  associatedBondingCurve: PublicKey;
  global: PublicKey;
  feeRecipient: PublicKey;
}

export class PumpFunAdapter {
  public static readonly PROGRAM_ID = PUMP_FUN_PROGRAM_ID;
  public static readonly FEE_RECIPIENT = PUMP_FEE_RECIPIENT;

  /**
   * Derives the bonding curve PDA for a token mint
   */
  public static getBondingCurvePDA(mint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("bonding-curve"), mint.toBuffer()],
      this.PROGRAM_ID
    );
  }

  /**
   * Derives the global configuration PDA
   */
  public static getGlobalPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      this.PROGRAM_ID
    );
  }

  /**
   * Constructs token creation instruction for Pump.fun
   */
  public static createTokenInstruction(params: {
    mint: PublicKey;
    mintAuthority: PublicKey;
    bondingCurve: PublicKey;
    associatedBondingCurve: PublicKey;
    global: PublicKey;
    payer: PublicKey;
    name: string;
    symbol: string;
    uri: string;
  }): TransactionInstruction {
    // 8-byte discriminator for 'create' instruction on Pump.fun
    const createDiscriminator = Buffer.from([24, 30, 200, 40, 5, 28, 7, 119]);
    
    const nameBuffer = Buffer.from(params.name, "utf8");
    const symbolBuffer = Buffer.from(params.symbol, "utf8");
    const uriBuffer = Buffer.from(params.uri, "utf8");

    // Layout: discriminator + name len(4) + name + symbol len(4) + symbol + uri len(4) + uri
    const data = Buffer.alloc(
      8 + 4 + nameBuffer.length + 4 + symbolBuffer.length + 4 + uriBuffer.length
    );

    let offset = 0;
    createDiscriminator.copy(data, offset);
    offset += 8;

    data.writeUInt32LE(nameBuffer.length, offset);
    offset += 4;
    nameBuffer.copy(data, offset);
    offset += nameBuffer.length;

    data.writeUInt32LE(symbolBuffer.length, offset);
    offset += 4;
    symbolBuffer.copy(data, offset);
    offset += symbolBuffer.length;

    data.writeUInt32LE(uriBuffer.length, offset);
    offset += 4;
    uriBuffer.copy(data, offset);

    return new TransactionInstruction({
      programId: this.PROGRAM_ID,
      keys: [
        { pubkey: params.mint, isSigner: true, isWritable: true },
        { pubkey: params.mintAuthority, isSigner: false, isWritable: false },
        { pubkey: params.bondingCurve, isSigner: false, isWritable: true },
        { pubkey: params.associatedBondingCurve, isSigner: false, isWritable: true },
        { pubkey: params.global, isSigner: false, isWritable: false },
        { pubkey: params.payer, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      data,
    });
  }

  /**
   * Constructs buy instruction on bonding curve
   */
  public static buyInstruction(params: {
    payer: PublicKey;
    mint: PublicKey;
    bondingCurve: PublicKey;
    associatedBondingCurve: PublicKey;
    associatedUserToken: PublicKey;
    amountLamports: bigint;
    maxSolCost: bigint;
  }): TransactionInstruction {
    // 8-byte discriminator for 'buy'
    const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);
    const data = Buffer.alloc(8 + 8 + 8);
    buyDiscriminator.copy(data, 0);
    data.writeBigUInt64LE(params.amountLamports, 8);
    data.writeBigUInt64LE(params.maxSolCost, 16);

    return new TransactionInstruction({
      programId: this.PROGRAM_ID,
      keys: [
        { pubkey: this.getGlobalPDA()[0], isSigner: false, isWritable: false },
        { pubkey: this.FEE_RECIPIENT, isSigner: false, isWritable: true },
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
}
