import { ExportedWalletKeys, SubWallet } from "../../types";

export class WalletExporter {
  /**
   * Generates a downloadable JSON backup containing sub-wallet identities and encrypted keys.
   */
  public static exportToJson(wallets: SubWallet[]): string {
    const backup = {
      version: "1.0-SCRAMJET-BACKUP",
      timestamp: new Date().toISOString(),
      walletCount: wallets.length,
      wallets: wallets.map((w) => ({
        id: w.id,
        publicKey: w.publicKey,
        role: w.role,
        balanceSol: w.balanceSol,
        tokenBalance: w.tokenBalance,
        status: w.status,
        privateKeyEncrypted: w.privateKeyEncrypted ?? "Managed inside Turnkey Secure Enclave",
      })),
    };
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Generates a CSV export of all sub-wallets and balances for accounting & tax records.
   */
  public static exportToCsv(wallets: SubWallet[]): string {
    const headers = "ID,Public Key,Role,SOL Balance,Token Balance,Status,Key Type\n";
    const rows = wallets
      .map(
        (w) =>
          `"${w.id}","${w.publicKey}","${w.role}",${w.balanceSol},${w.tokenBalance},"${w.status}","${
            w.privateKeyEncrypted ? "Exportable" : "Turnkey MPC Enclave"
          }"`
      )
      .join("\n");
    return headers + rows;
  }

  /**
   * Generates CSV export of launch history & trade records for tax compliance.
   */
  public static exportTradeHistoryCsv(records: any[]): string {
    const headers = "Date,Token Mint,Type,Amount SOL,Fee SOL,Signature,Status\n";
    const rows = records
      .map(
        (r) =>
          `"${r.timestamp || new Date().toISOString()}","${r.tokenMint || ""}","${
            r.type || "HARVEST"
          }",${r.grossHarvestSol || r.amountSol || 0},${r.protocolFeeSol || 0},"${
            r.signature || ""
          }","${r.status || "CONFIRMED"}"`
      )
      .join("\n");
    return headers + rows;
  }
}
