import {
  AutopilotEasyLaunchConfig,
  AutopilotRiskProfile,
  CostBreakdownEstimate,
  LaunchTemplate,
  SubWallet,
} from "../../types";
import { calculateUpfrontLaunchFee } from "../feeRouter";
import { RentReclaimer } from "../wallets/rentReclaim";

export const PROVEN_LAUNCH_TEMPLATES: LaunchTemplate[] = [
  {
    id: "proven-volume-builder",
    name: "Proven Volume & Floor Builder",
    description: "The gold standard used by top graduates. 65% Dev & Front MEV allocation, 25% distributed holder sub-wallets, 10% Jito bribe reserve.",
    launchpad: "PUMP_FUN",
    preset: "CLEAN_BUILD",
    devBuyPercent: 12,
    holdersBuyPercent: 18,
    holderCount: 20,
    backMevTuning: 45,
    jitoTipSol: 0.015,
    sniperGuardEnabled: true,
    sniperTriggerSol: 4.5,
    buybackBurnPercent: 50,
    isOfficial: true,
  },
  {
    id: "stealth-anti-sniper",
    name: "Stealth Accumulation & Sniper Shield",
    description: "Maximum privacy configuration. Tight Front MEV + Back MEV tuning to minimize detection markers, aggressive Nuke threshold.",
    launchpad: "METEORA_DBC",
    preset: "FULL_BUILD",
    devBuyPercent: 8,
    holdersBuyPercent: 15,
    holderCount: 24,
    backMevTuning: 25, // Less sniper markers
    jitoTipSol: 0.025,
    sniperGuardEnabled: true,
    sniperTriggerSol: 3.0,
    buybackBurnPercent: 75,
    isOfficial: true,
  },
  {
    id: "hypersonic-moonshot",
    name: "Hypersonic Moonshot (Fast Fill)",
    description: "Rapid bonding curve progression with immediate Front MEV cluster and automated Photon bump bot.",
    launchpad: "PUMP_FUN",
    preset: "QUICK_BUILD",
    devBuyPercent: 15,
    holdersBuyPercent: 25,
    holderCount: 16,
    backMevTuning: 60,
    jitoTipSol: 0.02,
    sniperGuardEnabled: true,
    sniperTriggerSol: 5.0,
    buybackBurnPercent: 25,
    isOfficial: true,
  },
];

export class AutopilotLauncher {
  /**
   * Automatically derives the optimal wallet count and budget allocation
   * from any user budget (e.g. 2 SOL, 5 SOL, 15 SOL, 50 SOL).
   */
  public static calculateAutopilotAllocation(
    totalBudgetSol: number,
    profile: AutopilotRiskProfile = "PROVEN_VOLUME",
    payerOrVault?: string
  ): {
    devBuySol: number;
    subWalletCount: number;
    subWalletBuySol: number;
    jitoTipSol: number;
    launchFeeSol: number;
    totalCommittedSol: number;
    expectedRentRefundSol: number;
  } {
    const budget = Math.max(0.5, totalBudgetSol);

    // Dynamic wallet count based on capital:
    // Under 3 SOL: 8 wallets
    // 3 - 10 SOL: 16 wallets
    // 10 - 25 SOL: 24 wallets
    // 25+ SOL: 32 wallets
    let subWalletCount = 8;
    if (budget >= 25) subWalletCount = 32;
    else if (budget >= 10) subWalletCount = 24;
    else if (budget >= 3) subWalletCount = 16;

    // Upfront launch fee
    const feeObj = calculateUpfrontLaunchFee(subWalletCount, payerOrVault);
    const launchFeeSol = feeObj.totalLaunchFeeSol;

    // Jito bribe reserve (0.015 - 0.035 SOL scaled by budget)
    const jitoTipSol = Number((0.01 + Math.min(0.025, budget * 0.002)).toFixed(3));

    // Net capital available for token purchases
    const netPurchasingSol = Math.max(0.1, budget - launchFeeSol - jitoTipSol);

    let devRatio = 0.4;
    if (profile === "AGGRESSIVE_MOONSHOT") devRatio = 0.55;
    else if (profile === "STEALTH_ACCUMULATION") devRatio = 0.3;

    const devBuySol = Number((netPurchasingSol * devRatio).toFixed(3));
    const subWalletBuySol = Number((netPurchasingSol * (1 - devRatio)).toFixed(3));

    const expectedRentRefundSol = Number(
      (subWalletCount * RentReclaimer.ATA_RENT_SOL).toFixed(4)
    );

    return {
      devBuySol,
      subWalletCount,
      subWalletBuySol,
      jitoTipSol,
      launchFeeSol,
      totalCommittedSol: Number(
        (launchFeeSol + jitoTipSol + devBuySol + subWalletBuySol).toFixed(4)
      ),
      expectedRentRefundSol,
    };
  }

  /**
   * Pre-calculates transparent dry-run cost breakdown before user signs anything.
   */
  public static estimateTotalCost(params: {
    devBuySol: number;
    subWalletCount: number;
    subWalletAllocatedSol: number;
    jitoTipSol: number;
    payerOrVault?: string;
  }): CostBreakdownEstimate {
    const { devBuySol, subWalletCount, subWalletAllocatedSol, jitoTipSol, payerOrVault } = params;
    const fee = calculateUpfrontLaunchFee(subWalletCount, payerOrVault);
    const accountRentSol = Number(
      (subWalletCount * RentReclaimer.ATA_RENT_SOL).toFixed(4)
    );

    const totalSolRequired = Number(
      (
        fee.totalLaunchFeeSol +
        devBuySol +
        subWalletAllocatedSol +
        jitoTipSol +
        accountRentSol
      ).toFixed(4)
    );

    return {
      baseLaunchFeeSol: fee.baseFeeSol,
      subWalletCoordinationFeeSol: fee.walletExecutionFeeSol,
      totalPlatformFeeSol: fee.totalLaunchFeeSol,
      devBuySol,
      subWalletFundingSol: subWalletAllocatedSol,
      accountRentSol,
      jitoBribeSol: jitoTipSol,
      totalSolRequired,
      expectedAtaRentRefundSol: accountRentSol,
    };
  }
}
