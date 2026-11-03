import { PublicKey } from "@solana/web3.js";

export const SCRAMJET_BRAND = {
  name: "SCRAMJET",
  codename: "MACH CASCADE",
  tagline: "Hypersonic Solana Token Launchpad & Creator Fee Protocol",
  version: "1.0.0-PROXIMA-KILLER",
  feePercent: 3.5, // 3.5% platform fee (undercutting Proxima's 5.0% by 30%)
};

// Official Solana Program IDs
export const PUMP_FUN_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

export const PUMP_FEE_RECIPIENT = new PublicKey(
  "CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM"
);

// Jito Tip Accounts for Block-0 Bundle inclusion
export const JITO_TIP_ACCOUNTS = [
  new PublicKey("96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5"),
  new PublicKey("HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe"),
  new PublicKey("Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY"),
  new PublicKey("ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49"),
  new PublicKey("DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh"),
  new PublicKey("ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt"),
  new PublicKey("DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL"),
  new PublicKey("3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT"),
];

export const JITO_BLOCK_ENGINE_URLS = [
  "https://frankfurt.mainnet.block-engine.jito.wtf",
  "https://amsterdam.mainnet.block-engine.jito.wtf",
  "https://ny.mainnet.block-engine.jito.wtf",
  "https://tokyo.mainnet.block-engine.jito.wtf",
  "https://slc.mainnet.block-engine.jito.wtf",
];

// Protocol Fee Split (3.5% standard)
export const PROTOCOL_FEE_BPS = 350; // 3.5% = 350 basis points
export const PROXIMA_FEE_BPS = 500;  // 5.0% = 500 basis points (competitor benchmark)

// Default platform fee collection vault
export const DEFAULT_PLATFORM_FEE_VAULT = new PublicKey(
  "CcwpTCpWMtKGo1fqnZuH4Psdj6yugbmSrAPaeTdEy6Qq"
);
