import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { SniperGuardConfig, SubWallet } from "../../types";

export interface SniperDefenseTrigger {
  triggered: boolean;
  action: "NUKE" | "COMPLETE_EARLY" | "NONE";
  externalBuyVolumeSol: number;
  walletsToLiquidate: SubWallet[];
}

export class SniperGuardEngine {
  /**
   * Evaluates external buy volume against trigger threshold.
   * If external snipers out-buy the threshold, triggers immediate Nuke or Early Completion.
   */
  public static evaluateDefense(params: {
    config: SniperGuardConfig;
    externalBuyVolumeSol: number;
    subWallets: SubWallet[];
    devWallet: SubWallet;
  }): SniperDefenseTrigger {
    const { config, externalBuyVolumeSol, subWallets, devWallet } = params;

    if (!config.enabled || externalBuyVolumeSol < config.triggerExternalBuySol) {
      return {
        triggered: false,
        action: "NONE",
        externalBuyVolumeSol,
        walletsToLiquidate: [],
      };
    }

    if (config.action === "COMPLETE_EARLY") {
      return {
        triggered: true,
        action: "COMPLETE_EARLY",
        externalBuyVolumeSol,
        walletsToLiquidate: [],
      };
    }

    // Action is NUKE
    let targets: SubWallet[] = [];
    if (config.nukeScope === "ALL") {
      targets = [devWallet, ...subWallets];
    } else if (config.nukeScope === "HOLDERS_ONLY") {
      targets = subWallets;
    } else if (config.nukeScope === "DEV_ONLY") {
      targets = [devWallet];
    }

    return {
      triggered: true,
      action: "NUKE",
      externalBuyVolumeSol,
      walletsToLiquidate: targets,
    };
  }
}
