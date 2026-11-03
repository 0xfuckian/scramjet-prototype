import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  type BlockhashWithExpiryBlockHeight,
  type Commitment,
  type ConnectionConfig,
} from "@solana/web3.js";

/** Cluster commitment used for reads, sends, and websocket subscriptions. */
export const SOLANA_COMMITMENT: Commitment = "confirmed";

/** Public mainnet beta RPC. Used when no provider URL is configured. */
const PUBLIC_DEVNET_RPC = "https://api.devnet.solana.com";
const PUBLIC_MAINNET_RPC = "https://api.mainnet-beta.solana.com";

export interface SolanaRpcEndpoints {
  /** First endpoint to try. */
  primary: string;
  /** Helius, Triton, QuickNode, and other URLs tried after the primary fails. */
  fallbacks: string[];
  /** WebSocket endpoint paired with the primary HTTP RPC. */
  wsEndpoint: string;
}

export interface TransactionConfirmation {
  signature: string;
  /** True when the signature has reached confirmed or finalized commitment without an error. */
  confirmed: boolean;
  slot: number | null;
  confirmationStatus: "processed" | "confirmed" | "finalized" | null;
  err: string | null;
}

const connectionPool = new Map<string, Connection>();
let activeEndpoint: string | null = null;
let activeConnection: Connection | null = null;

const slotHandlers = new Set<(slot: number) => void>();
let slotSubscriptionId: number | null = null;
let slotConnection: Connection | null = null;

function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseEndpointList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function uniqueEndpoints(endpoints: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const endpoint of endpoints) {
    if (!endpoint || seen.has(endpoint)) continue;
    seen.add(endpoint);
    ordered.push(endpoint);
  }
  return ordered;
}

/**
 * Resolves RPC endpoints from the environment.
 * Helius, Triton, and QuickNode are included only when their URLs are set,
 * so API keys are never embedded in source.
 *
 * Primary: NEXT_PUBLIC_SOLANA_RPC_URL or SOLANA_RPC_URL.
 * Provider fallbacks: NEXT_PUBLIC_HELIUS_RPC_URL, HELIUS_RPC_URL,
 * NEXT_PUBLIC_TRITON_RPC_URL, TRITON_RPC_URL,
 * NEXT_PUBLIC_QUICKNODE_RPC_URL, QUICKNODE_RPC_URL.
 * Extra list: NEXT_PUBLIC_SOLANA_RPC_FALLBACKS or SOLANA_RPC_FALLBACKS
 * (comma or whitespace separated).
 * WebSocket override: NEXT_PUBLIC_SOLANA_WS_URL or SOLANA_WS_URL.
 * Public mainnet is always the last fallback.
 */
export function resolveSolanaRpcEndpoints(): SolanaRpcEndpoints {
  const isDevnet =
    process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet" ||
    process.env.SOLANA_NETWORK === "devnet";

  if (isDevnet) {
    const devnetPrimary =
      readEnv(process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL) ??
      readEnv(process.env.NEXT_PUBLIC_SOLANA_RPC_URL) ??
      PUBLIC_DEVNET_RPC;
    const devnetWs =
      readEnv(process.env.NEXT_PUBLIC_SOLANA_DEVNET_WS_URL) ??
      toWebSocketUrl(devnetPrimary) ??
      "wss://api.devnet.solana.com";

    return {
      primary: devnetPrimary,
      fallbacks: [PUBLIC_DEVNET_RPC],
      wsEndpoint: devnetWs,
    };
  }

  const ordered = uniqueEndpoints([
    readEnv(process.env.NEXT_PUBLIC_SOLANA_RPC_URL),
    readEnv(process.env.SOLANA_RPC_URL),
    readEnv(process.env.NEXT_PUBLIC_HELIUS_RPC_URL),
    readEnv(process.env.HELIUS_RPC_URL),
    readEnv(process.env.NEXT_PUBLIC_TRITON_RPC_URL),
    readEnv(process.env.TRITON_RPC_URL),
    readEnv(process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL),
    readEnv(process.env.QUICKNODE_RPC_URL),
    ...parseEndpointList(process.env.NEXT_PUBLIC_SOLANA_RPC_FALLBACKS),
    ...parseEndpointList(process.env.SOLANA_RPC_FALLBACKS),
    PUBLIC_MAINNET_RPC,
  ]);

  const primary = ordered[0] ?? PUBLIC_MAINNET_RPC;
  const wsOverride =
    readEnv(process.env.NEXT_PUBLIC_SOLANA_WS_URL) ?? readEnv(process.env.SOLANA_WS_URL);

  return {
    primary,
    fallbacks: ordered.filter((endpoint) => endpoint !== primary),
    wsEndpoint: wsOverride ?? toWebSocketUrl(primary) ?? primary,
  };
}

export function toPublicKey(value: PublicKey | string): PublicKey {
  if (value instanceof PublicKey) return value;
  return new PublicKey(value);
}

function toWebSocketUrl(endpoint: string): string | undefined {
  try {
    const url = new URL(endpoint);
    if (url.protocol === "https:") url.protocol = "wss:";
    else if (url.protocol === "http:") url.protocol = "ws:";
    else if (url.protocol !== "wss:" && url.protocol !== "ws:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function openConnection(endpoint: string): Connection {
  const cached = connectionPool.get(endpoint);
  if (cached) return cached;

  const { primary, wsEndpoint } = resolveSolanaRpcEndpoints();
  const socket = endpoint === primary ? wsEndpoint : toWebSocketUrl(endpoint);
  const config: ConnectionConfig = {
    commitment: SOLANA_COMMITMENT,
    confirmTransactionInitialTimeout: 60_000,
    disableRetryOnRateLimit: true,
  };
  if (socket) config.wsEndpoint = socket;

  const connection = new Connection(endpoint, config);
  connectionPool.set(endpoint, connection);
  return connection;
}

function orderedEndpoints(): string[] {
  const { primary, fallbacks } = resolveSolanaRpcEndpoints();
  const all = [primary, ...fallbacks];
  if (!activeEndpoint || !all.includes(activeEndpoint)) {
    activeEndpoint = primary;
  }
  return [activeEndpoint, ...all.filter((endpoint) => endpoint !== activeEndpoint)];
}

function detachSlotSocket(): void {
  if (slotConnection && slotSubscriptionId !== null) {
    void slotConnection.removeSlotChangeListener(slotSubscriptionId).catch(() => undefined);
  }
  slotSubscriptionId = null;
  slotConnection = null;
}

function attachSlotSocket(): void {
  if (slotHandlers.size === 0) return;
  const connection = getSolanaConnection();
  if (slotConnection === connection && slotSubscriptionId !== null) return;

  detachSlotSocket();
  slotConnection = connection;
  slotSubscriptionId = connection.onSlotChange((slotInfo) => {
    for (const handler of slotHandlers) handler(slotInfo.slot);
  });
}

/**
 * Live Solana RPC connection (commitment `confirmed`, WebSocket enabled).
 * The instance follows the endpoint that most recently answered.
 */
export function getSolanaConnection(): Connection {
  const { primary } = resolveSolanaRpcEndpoints();
  if (!activeEndpoint) activeEndpoint = primary;
  if (!activeConnection || activeConnection.rpcEndpoint !== activeEndpoint) {
    activeConnection = openConnection(activeEndpoint);
  }
  return activeConnection;
}

function errorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isMissingAccountError(error: unknown): boolean {
  const message = errorText(error).toLowerCase();
  return message.includes("could not find account") || message.includes("account does not exist");
}

/** Transport and provider failures are worth trying on the next endpoint. */
function isFailoverError(error: unknown): boolean {
  const message = errorText(error).toLowerCase();
  if (message.includes("invalid public key")) return false;
  if (message.includes("non-base58")) return false;
  if (isMissingAccountError(error)) return false;
  if (message.includes("invalid param")) return false;

  return (
    message.includes("429") ||
    message.includes("403") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504") ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("econn") ||
    message.includes("enotfound") ||
    message.includes("socket") ||
    message.includes("rate limit") ||
    message.includes("too many request") ||
    message.includes("bad gateway") ||
    message.includes("service unavailable")
  );
}

/**
 * Runs an RPC call against the active endpoint, then Helius / Triton / public
 * fallbacks when the failure looks like a provider outage.
 */
export async function withSolanaRpc<T>(
  operation: (connection: Connection) => Promise<T>
): Promise<T> {
  const endpoints = orderedEndpoints();
  let lastError: unknown;

  for (let index = 0; index < endpoints.length; index += 1) {
    const endpoint = endpoints[index];
    const connection = openConnection(endpoint);
    try {
      const result = await operation(connection);
      if (activeEndpoint !== endpoint) {
        activeEndpoint = endpoint;
        activeConnection = connection;
        attachSlotSocket();
      }
      return result;
    } catch (error) {
      lastError = error;
      const canFailover = isFailoverError(error) && index < endpoints.length - 1;
      if (!canFailover) {
        throw error instanceof Error ? error : new Error(errorText(error));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Solana RPC request failed");
}

/**
 * Subscribes to `connection.onSlotChange`. The handler is rebound if the
 * active endpoint changes.
 */
export function watchSlotChanges(handler: (slot: number) => void): () => void {
  slotHandlers.add(handler);
  attachSlotSocket();
  return () => {
    slotHandlers.delete(handler);
    if (slotHandlers.size === 0) detachSlotSocket();
  };
}

/** Live SOL balance for `pubkey`, in SOL. */
export async function getSolBalance(pubkey: PublicKey | string): Promise<number> {
  const owner = toPublicKey(pubkey);
  const lamports = await withSolanaRpc((connection) =>
    connection.getBalance(owner, SOLANA_COMMITMENT)
  );
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Raw token amount for an associated token account.
 * Missing accounts return 0. Transport errors still throw.
 */
export async function getTokenBalance(ataPubkey: PublicKey | string): Promise<number> {
  const ata = toPublicKey(ataPubkey);
  try {
    const response = await withSolanaRpc((connection) =>
      connection.getTokenAccountBalance(ata, SOLANA_COMMITMENT)
    );
    return Number(response.value.amount);
  } catch (error) {
    if (isMissingAccountError(error)) return 0;
    throw error;
  }
}

/** Latest confirmed blockhash and last valid block height. */
export async function getLatestBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
  return withSolanaRpc((connection) => connection.getLatestBlockhash(SOLANA_COMMITMENT));
}

function stringifyTxnError(err: unknown): string {
  if (err == null) return "";
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Watches a signature over the confirmed websocket (`onSignature`) and polls
 * `getSignatureStatuses` so confirmation still resolves if the socket drops.
 */
export async function monitorTransactionConfirmation(
  signature: string
): Promise<TransactionConfirmation> {
  const timeoutMs = 45_000;
  const started = Date.now();
  const connection = getSolanaConnection();

  return new Promise<TransactionConfirmation>((resolve, reject) => {
    let settled = false;
    let subscriptionId: number | null = null;
    let lastError: unknown;

    const cleanup = () => {
      if (subscriptionId === null) return;
      const id = subscriptionId;
      subscriptionId = null;
      void connection.removeSignatureListener(id).catch(() => undefined);
    };

    const finish = (result: TransactionConfirmation) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error instanceof Error ? error : new Error(errorText(error)));
    };

    try {
      subscriptionId = connection.onSignature(
        signature,
        (result, context) => {
          const err = result.err ? stringifyTxnError(result.err) : null;
          finish({
            signature,
            confirmed: err === null,
            slot: context.slot,
            confirmationStatus: "confirmed",
            err,
          });
        },
        SOLANA_COMMITMENT
      );
    } catch (error) {
      lastError = error;
      subscriptionId = null;
    }

    const poll = async () => {
      while (!settled && Date.now() - started < timeoutMs) {
        try {
          const response = await withSolanaRpc((rpc) =>
            rpc.getSignatureStatuses([signature], { searchTransactionHistory: true })
          );
          const status = response.value[0];
          if (status) {
            const confirmationStatus = status.confirmationStatus ?? null;
            const landed =
              confirmationStatus === "confirmed" ||
              confirmationStatus === "finalized" ||
              status.err != null;
            if (landed) {
              const err = status.err ? stringifyTxnError(status.err) : null;
              const reachedCommitment =
                confirmationStatus === "confirmed" || confirmationStatus === "finalized";
              finish({
                signature,
                confirmed: reachedCommitment && err === null,
                slot: status.slot,
                confirmationStatus,
                err,
              });
              return;
            }
          }
        } catch (error) {
          lastError = error;
        }
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 1_500));
      }

      if (!settled) {
        fail(
          lastError instanceof Error
            ? lastError
            : new Error(`Timed out waiting for confirmation of ${signature}`)
        );
      }
    };

    void poll();
  });
}
