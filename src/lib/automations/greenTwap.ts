import { SubWallet } from "../../types";

export interface TwapExecutionSlice {
  wallet: SubWallet;
  sellTokenAmount: number;
  expectedSolOutput: number;
  conditionMet: boolean;
}

export class GreenCandleTwapEngine {
  /**
   * Evaluates if the current market candle is green (positive delta).
   * Sub-wallets only execute micro-sells when current price > previous interval price,
   * preventing single-candle chart crashes.
   */
  public static shouldExecuteSlice(currentPriceSol: number, candleOpenPriceSol: number): boolean {
    return currentPriceSol >= candleOpenPriceSol;
  }

  /**
   * Plans the next batch of micro-sells across eligible sub-wallets
   */
  public static planNextSlice(params: {
    wallets: SubWallet[];
    maxSellPercentPerSlice: number;
    currentPriceSol: number;
    candleOpenPriceSol: number;
  }): TwapExecutionSlice[] {
    const { wallets, maxSellPercentPerSlice, currentPriceSol, candleOpenPriceSol } = params;
    const isGreen = this.shouldExecuteSlice(currentPriceSol, candleOpenPriceSol);

    return wallets.map((wallet) => {
      const sellAmount = (wallet.tokenBalance * maxSellPercentPerSlice) / 100;
      const expectedSol = sellAmount * currentPriceSol;

      return {
        wallet,
        sellTokenAmount: Math.floor(sellAmount),
        expectedSolOutput: Number(expectedSol.toFixed(4)),
        conditionMet: isGreen && wallet.tokenBalance > 0,
      };
    });
  }
}
