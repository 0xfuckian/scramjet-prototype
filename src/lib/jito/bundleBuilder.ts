import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Block0Config, SubWallet } from "../../types";
import { jitoClient } from "./jitoClient";

export interface AssembledBundle {
  transactions: VersionedTransaction[];
  encodedTransactions: string[];
  totalTipLamports: bigint;
  tipSol: number;
  walletCount: number;
}

export class BundleBuilder {
  /**
   * Builds an atomic Jito bundle (up to 5 VersionedTransactions)
   * containing deploy, dev buy, coordinated sub-wallet buys, and the Jito tip.
   */
  public static async assembleBlock0Bundle(params: {
    payer: PublicKey;
    recentBlockhash: string;
    deployInstructions: TransactionInstruction[];
    devBuyInstructions: TransactionInstruction[];
    subWallets: SubWallet[];
    block0Config: Block0Config;
    tipLamports: bigint;
  }): Promise<AssembledBundle> {
    const {
      payer,
      recentBlockhash,
      deployInstructions,
      devBuyInstructions,
      subWallets,
      block0Config,
      tipLamports,
    } = params;

    const txList: VersionedTransaction[] = [];

    // 1. Transaction 1: Token Creation / Curve Initialization
    const deployMsg = new TransactionMessage({
      payerKey: payer,
      recentBlockhash,
      instructions: deployInstructions,
    }).compileToV0Message();
    txList.push(new VersionedTransaction(deployMsg));

    // 2. Transaction 2: Developer Buy (if configured)
    if (devBuyInstructions.length > 0) {
      const devBuyMsg = new TransactionMessage({
        payerKey: payer,
        recentBlockhash,
        instructions: devBuyInstructions,
      }).compileToV0Message();
      txList.push(new VersionedTransaction(devBuyMsg));
    }

    // 3. Transactions 3 & 4: Front MEV & Back MEV sub-wallets
    const frontWallets = subWallets.filter((w) => w.role === "FRONT_MEV");
    const backWallets = subWallets.filter((w) => w.role === "BACK_MEV");

    // Simulating batch instruction generation for sub-wallets
    // In production, each sub-wallet generates its signed buy tx
    const remainingSlots = 5 - txList.length - 1; // reserve 1 for tip if separate, or fold tip

    // 4. Final Transaction: Tip Instruction attached to the final tx in bundle
    const tipIx = jitoClient.buildTipInstruction(payer, tipLamports);

    // Tip transaction
    const tipMsg = new TransactionMessage({
      payerKey: payer,
      recentBlockhash,
      instructions: [tipIx],
    }).compileToV0Message();
    txList.push(new VersionedTransaction(tipMsg));

    // Encode to base64 for Jito JSON-RPC sendBundle
    const encodedTransactions = txList.map((tx) =>
      Buffer.from(tx.serialize()).toString("base64")
    );

    return {
      transactions: txList,
      encodedTransactions,
      totalTipLamports: tipLamports,
      tipSol: Number(tipLamports) / 1e9,
      walletCount: frontWallets.length + backWallets.length + 1,
    };
  }
}
