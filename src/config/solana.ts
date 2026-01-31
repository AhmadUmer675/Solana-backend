import { Connection, PublicKey } from '@solana/web3.js';

/**
 * Solana RPC URL (mainnet, devnet, or custom).
 * Default: mainnet-beta.
 */
export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

/**
 * Platform wallet that receives the 0.10 SOL fee.
 * MUST be set in .env as a valid Solana base58 public key (32–44 chars).
 */
const raw = process.env.PLATFORM_WALLET_ADDRESS;
const cleaned = typeof raw === 'string'
  ? raw.trim().replace(/^["']|["']$/g, '')
  : '';
export const PLATFORM_WALLET_ADDRESS = cleaned;

if (!PLATFORM_WALLET_ADDRESS) {
  throw new Error(
    'PLATFORM_WALLET_ADDRESS is required. Set it in .env to your Solana wallet public key (base58, e.g. from Phantom).'
  );
}

/** Validate platform wallet is a valid Solana public key. */
let platformWalletPubkey: PublicKey;
try {
  platformWalletPubkey = new PublicKey(PLATFORM_WALLET_ADDRESS);
} catch {
  throw new Error(
    'PLATFORM_WALLET_ADDRESS is not a valid Solana public key. Use your wallet PUBLIC KEY only (base58, 32–44 chars). Example: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU. Do NOT use private keys or seed phrases.'
  );
}

export const PLATFORM_WALLET_PUBKEY = platformWalletPubkey;

/** Fee in lamports (0.00 SOL = 0 lamports). */
export const FEE_LAMPORTS = 0;

/** Solana connection instance. */
export const solanaConnection = new Connection(SOLANA_RPC_URL, {
  commitment: 'confirmed',
});
