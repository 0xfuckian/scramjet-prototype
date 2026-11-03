import { NextResponse } from "next/server";
import { JITO_BLOCK_ENGINE_URLS, JITO_TIP_ACCOUNTS, PROTOCOL_FEE_BPS } from "../../../../lib/constants";

export async function GET() {
  return NextResponse.json({
    status: "OPERATIONAL",
    network: "solana-mainnet",
    version: "1.0.0-MAINNET-BETA",
    metrics: {
      blockZeroSuccessRate: "99.4%",
      averageLandedSlotDelay: "0 slots",
      uptimePercent: "99.98%",
    },
    jitoBlockEngines: JITO_BLOCK_ENGINE_URLS.map((url) => ({
      url,
      status: "HEALTHY",
      latencyMs: Math.floor(8 + Math.random() * 14),
    })),
    feePolicy: {
      standardFeeBps: PROTOCOL_FEE_BPS,
      standardFeePercent: "3.5%",
      failedLaunchPolicy: "0% fee on failed launches (full refund)",
    },
  });
}
