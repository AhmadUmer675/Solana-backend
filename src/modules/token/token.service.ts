import { PublicKey } from '@solana/web3.js';
import { Token } from '../../models/Token';
import { buildFeeTransaction } from '../payment/payment.service';
import { verifyFeePayment } from '../payment/payment.service';
import { createTokenMintTransaction } from '../../utils/createTransaction';
import { solanaConnection } from '../../config/solana';

const DEFAULT_DECIMALS = 9;

export interface FeeTransactionResult {
  serializedTransaction: string;
  lastValidBlockHeight: number;
}

export interface CreateTokenInput {
  wallet: string;
  tokenName: string;
  symbol: string;
  supply: string | number;
  decimals?: number;
  description?: string;
  logoUri?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  feeTxSignature: string;
  mintPublicKey: string;
}

export interface CreateTokenResult {
  serializedTransaction: string;
  lastValidBlockHeight: number;
  mintAddress: string;
  tokenId: number;
}

/**
 * Token service: fee tx creation, fee verification, token mint tx creation, DB persistence.
 * No private keys or signing on backend.
 */

/**
 * Creates unsigned 0.10 SOL fee transaction for the given wallet.
 */
export async function createFeeTx(userWallet: PublicKey): Promise<FeeTransactionResult> {
  return buildFeeTransaction(userWallet, solanaConnection);
}

/**
 * Validates create-token input and converts supply to base units.
 */
function parseSupply(supply: string | number, decimals: number = DEFAULT_DECIMALS): { value: bigint; error?: string } {
  const s = typeof supply === 'number' ? String(supply) : (supply || '').trim();
  if (!s) return { value: BigInt(0), error: 'Supply is required.' };

  const num = Number(s);
  if (!Number.isFinite(num) || num <= 0) {
    return { value: BigInt(0), error: 'Supply must be a positive number.' };
  }

  // Validate decimals
  if (decimals < 0 || decimals > 18) {
    return { value: BigInt(0), error: 'Decimals must be between 0 and 18.' };
  }

  // Convert from human-readable (e.g. 1000) to base units with custom decimals
  const factor = 10 ** decimals;
  const baseUnits = BigInt(Math.floor(num * factor));
  if (baseUnits <= 0) return { value: BigInt(0), error: 'Supply too small.' };

  return { value: baseUnits };
}

/**
 * Creates unsigned SPL token mint transaction, verifies fee, and stores token in DB.
 * Throws on validation or verification failure.
 */
export async function createToken(input: CreateTokenInput): Promise<CreateTokenResult> {
  const { 
    wallet, 
    tokenName, 
    symbol, 
    supply, 
    decimals = DEFAULT_DECIMALS,
    description,
    logoUri,
    website,
    twitter,
    telegram,
    discord,
    feeTxSignature, 
    mintPublicKey 
  } = input;

  const walletPubkey = new PublicKey(wallet);
  const mintPubkey = new PublicKey(mintPublicKey);

  const name = (tokenName || '').trim();
  if (!name || name.length > 64) {
    throw new Error('Token name is required and must be at most 64 characters.');
  }

  const sym = (symbol || '').trim().toUpperCase();
  if (!sym || sym.length > 16) {
    throw new Error('Symbol is required and must be at most 16 characters.');
  }

  // Validate decimals
  const tokenDecimals = Math.max(0, Math.min(18, Math.floor(decimals)));
  if (decimals !== tokenDecimals) {
    throw new Error('Decimals must be an integer between 0 and 18.');
  }

  const { value: supplyBase, error: supplyError } = parseSupply(supply, tokenDecimals);
  if (supplyError) throw new Error(supplyError);

  const sig = (feeTxSignature || '').trim();
  if (!sig) throw new Error('Fee transaction signature is required.');

  const feeOk = await verifyFeePayment(sig, walletPubkey, solanaConnection);
  if (!feeOk) {
    throw new Error(
      'Fee payment could not be verified. Ensure the 0.10 SOL fee transaction was sent and confirmed.'
    );
  }

  const { serializedTransaction, lastValidBlockHeight } =
    await createTokenMintTransaction({
      userWallet: walletPubkey,
      mintPublicKey: mintPubkey,
      decimals: tokenDecimals,
      supply: supplyBase,
      connection: solanaConnection,
    });

  const mintAddress = mintPubkey.toBase58();

  // Store token with metadata
  const token = await Token.create({
    user_wallet: wallet,
    token_name: name,
    symbol: sym,
    mint_address: mintAddress,
    supply: supplyBase.toString(),
    decimals: tokenDecimals,
    description: description?.trim() || null,
    logo_uri: logoUri?.trim() || null,
    website: website?.trim() || null,
    twitter: twitter?.trim() || null,
    telegram: telegram?.trim() || null,
    discord: discord?.trim() || null,
    fee_paid: true,
  });

  return {
    serializedTransaction,
    lastValidBlockHeight,
    mintAddress,
    tokenId: token.id,
  };
}
