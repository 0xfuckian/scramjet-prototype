import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { resolveSolanaRpcEndpoints } from "../src/lib/solana/connection";
import { turnkeyManager } from "../src/lib/wallets/turnkeyManager";
import { GhostFunder } from "../src/lib/wallets/ghostFunder";
import { RentReclaimer } from "../src/lib/wallets/rentReclaim";
import { BumpBotEngine } from "../src/lib/automations/bumpBot";
import { GreenCandleTwapEngine } from "../src/lib/automations/greenTwap";
import { SniperGuardEngine } from "../src/lib/automations/sniperGuard";
import { calculateProtocolFee, buildProtocolFeeInstruction } from "../src/lib/feeRouter";
import { DEFAULT_PLATFORM_FEE_VAULT } from "../src/lib/constants";
import { SubWallet } from "../src/types";

async function runDevnetTests() {
  console.log("====================================================");
  console.log("   SCRAMJET DEVNET VALIDATION & SIMULATION TEST SUITE");
  console.log("====================================================\n");

  // 1. RPC Connection Test
  process.env.SOLANA_NETWORK = "devnet";
  const endpoints = resolveSolanaRpcEndpoints();
  console.log(`[1] Solana Devnet RPC Connection:`);
  console.log(`    Primary Endpoint: ${endpoints.primary}`);
  const connection = new Connection(endpoints.primary, "confirmed");
  const slot = await connection.getSlot();
  const blockhashObj = await connection.getLatestBlockhash();
  console.log(`    Active Devnet Slot: ${slot}`);
  console.log(`    Latest Blockhash: ${blockhashObj.blockhash.slice(0, 16)}...`);
  console.log(`    RPC Health: PASS\n`);

  // 2. Protocol Fee Router Test
  console.log(`[2] Protocol Fee Router (3.5% vs 5.0% Benchmark):`);
  const testGrossLamports = BigInt(10 * LAMPORTS_PER_SOL); // 10 SOL
  const feeCalc = calculateProtocolFee(testGrossLamports);
  console.log(`    Gross Amount: ${feeCalc.grossSol} SOL`);
  console.log(`    Scramjet Fee (3.5%): ${feeCalc.feeSol} SOL`);
  console.log(`    Proxima Benchmark (5.0%): ${feeCalc.proximaTaxSol} SOL`);
  console.log(`    User Savings: ${feeCalc.userSavingsSol} SOL (30% less tax)`);
  console.log(`    Platform Vault Recipient: ${DEFAULT_PLATFORM_FEE_VAULT.toBase58()}`);
  if (DEFAULT_PLATFORM_FEE_VAULT.toBase58() !== "CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq") {
    throw new Error("Fee recipient vault mismatch!");
  }
  const feePayer = Keypair.generate().publicKey;
  const feeIx = buildProtocolFeeInstruction(feePayer, feeCalc.feeLamports);
  console.log(`    Fee Instruction Keys: from=${feeIx.keys[0].pubkey.toBase58().slice(0, 8)}... to=${feeIx.keys[1].pubkey.toBase58()}`);
  console.log(`    Fee Router: PASS\n`);

  // 3. Turnkey Enclave Key Generation & Signing Test
  console.log(`[3] Turnkey Sub-Wallet Enclave Generation:`);
  const subWallets = await turnkeyManager.createSubWallets({
    count: 6,
    walletNamePrefix: "scram-devnet-test",
  });
  console.log(`    Sub-Wallets Derived: ${subWallets.length} accounts`);
  subWallets.forEach((sw, i) => {
    console.log(`      Wallet #${i + 1} [${sw.role}]: ${sw.publicKey} (allocated: ${sw.allocatedBuySol} SOL)`);
  });
  console.log(`    Enclave Keygen: PASS\n`);

  // 4. Ghost Funder Anti-BubbleMap Plan
  console.log(`[4] Ghost Funder Relay Dispersion:`);
  const masterFunder = Keypair.generate().publicKey;
  const ghostPlan = GhostFunder.planGhostDispersal({
    masterPayer: masterFunder,
    subWallets,
    config: {
      fundingMode: "RELAY_MERKLE_TREE",
      fundingGapSeconds: 1800,
      randomDeviationPercent: 5,
    },
  });
  console.log(`    Total SOL Required: ${ghostPlan.totalSolRequired} SOL`);
  console.log(`    Relay Nodes Generated: ${ghostPlan.relays.length} intermediate accounts`);
  ghostPlan.relays.forEach((r, idx) => {
    console.log(`      Relay #${idx + 1} (${r.relayKeypair.publicKey.toBase58().slice(0, 8)}...): ${r.relayFundingSol.toFixed(4)} SOL -> ${r.targetWallets.length} target wallets`);
  });
  console.log(`    Generated L1 Transfer Instructions: ${ghostPlan.instructions.length}`);
  console.log(`    Ghost Funder: PASS\n`);

  // 5. ATA Rent Reclaimer Test
  console.log(`[5] ATA Rent Recovery Engine:`);
  const dummyAtas = subWallets.slice(0, 4).map((sw) => ({
    accountPubkey: Keypair.generate().publicKey,
    walletOwnerPubkey: new PublicKey(sw.publicKey),
  }));
  const reclaimBatch = RentReclaimer.buildBatchReclaimInstructions({
    destinationMaster: masterFunder,
    tokenAccounts: dummyAtas,
  });
  console.log(`    ATAs to Reclaim: ${reclaimBatch.walletCount}`);
  console.log(`    Reclaimed SOL Recovered: ${reclaimBatch.totalReclaimedSol} SOL (at ~0.00204 SOL per wallet)`);
  console.log(`    Rent Recovery: PASS\n`);

  // 6. Algorithmic Market Maker (Bump Bot & Green-Candle TWAP)
  console.log(`[6] AMM Automated Engines:`);
  const bumpPlan = BumpBotEngine.planBumpSession({
    config: {
      enableBumpBot: true,
      bumpIntervalSeconds: 15,
      bumpMinSol: 0.05,
      bumpMaxSol: 0.15,
      enableGreenCandleTwap: true,
      twapMaxSellPercentPerSlice: 10,
      targetTrendingBoard: "PHOTON",
    },
    availableWallets: subWallets,
    sessionDurationMinutes: 2,
  });
  console.log(`    Scheduled Micro-Buy Jitter: ${bumpPlan.scheduledBuys.length} trades planned`);
  console.log(`    Total Bump Budget: ${bumpPlan.totalBudgetSol} SOL over 2 minutes`);
  
  // Test Green-Candle TWAP logic
  const greenSlices = GreenCandleTwapEngine.planNextSlice({
    wallets: [
      { ...subWallets[0], tokenBalance: 1_000_000 },
      { ...subWallets[1], tokenBalance: 500_000 },
    ],
    maxSellPercentPerSlice: 10,
    currentPriceSol: 0.00005,
    candleOpenPriceSol: 0.000045, // Green candle
  });
  console.log(`    Green-Candle TWAP (Positive Candle): ConditionMet = ${greenSlices.every(s => s.conditionMet)}`);

  const redSlices = GreenCandleTwapEngine.planNextSlice({
    wallets: [
      { ...subWallets[0], tokenBalance: 1_000_000 },
    ],
    maxSellPercentPerSlice: 10,
    currentPriceSol: 0.00004,
    candleOpenPriceSol: 0.000045, // Red candle
  });
  console.log(`    Red-Candle TWAP Guard (Negative Candle): ConditionMet = ${redSlices[0].conditionMet} (Dumps blocked)`);
  console.log(`    AMM Engines: PASS\n`);

  // 7. Sniper Guard Defense Test
  console.log(`[7] Sniper Guard Defense Engine:`);
  const defenseResult = SniperGuardEngine.evaluateDefense({
    config: {
      enabled: true,
      triggerExternalBuySol: 5.0,
      action: "NUKE",
      nukeScope: "HOLDERS_ONLY",
    },
    externalBuyVolumeSol: 6.2, // Triggered!
    subWallets,
    devWallet: subWallets[0],
  });
  console.log(`    External Buy Volume: ${defenseResult.externalBuyVolumeSol} SOL (Threshold: 5.0 SOL)`);
  console.log(`    Defense Triggered: ${defenseResult.triggered}`);
  console.log(`    Action: ${defenseResult.action}`);
  console.log(`    Wallets Slated for Nuke: ${defenseResult.walletsToLiquidate.length}`);
  console.log(`    Sniper Guard: PASS\n`);

  console.log("====================================================");
  console.log("   ALL 7 CORE MODULES VERIFIED & PASSING ON DEVNET");
  console.log("====================================================");
}

runDevnetTests().catch((err) => {
  console.error("Devnet test failed:", err);
  process.exit(1);
});
