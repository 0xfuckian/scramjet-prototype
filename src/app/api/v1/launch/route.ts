import { NextRequest, NextResponse } from "next/server";
import { AutopilotLauncher } from "../../../../lib/pipeline/autopilotLauncher";
import { calculateUpfrontLaunchFee, isExemptFromFees } from "../../../../lib/feeRouter";
import { DEFAULT_PLATFORM_FEE_VAULT } from "../../../../lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenName, tokenSymbol, launchpad, totalBudgetSol, subWalletCount, payerAddress } = body;

    if (!tokenName || !tokenSymbol) {
      return NextResponse.json({ error: "Missing required token metadata" }, { status: 400 });
    }

    const isExempt = isExemptFromFees(payerAddress);
    const feeEstimate = calculateUpfrontLaunchFee(subWalletCount || 16, payerAddress);

    const allocation = AutopilotLauncher.calculateAutopilotAllocation(
      totalBudgetSol || 5.0,
      "PROVEN_VOLUME",
      payerAddress
    );

    return NextResponse.json({
      status: "SUCCESS",
      launchConfig: {
        tokenName,
        tokenSymbol,
        launchpad: launchpad || "PUMP_FUN",
        allocation,
        feeEstimate,
        platformFeeVault: DEFAULT_PLATFORM_FEE_VAULT.toBase58(),
        isExempt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
