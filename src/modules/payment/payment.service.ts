import { Connection, PublicKey } from '@solana/web3.js';
import { solanaConnection, PLATFORM_WALLET_PUBKEY, FEE_LAMPORTS } from '../../config/solana';
import { createFeeTransaction } from '../../utils/createTransaction';

/**
 * Payment service: fee transaction creation and verification.
 * NEVER signs transactions or accesses private keys.
 */

/**
 * Builds unsigned 0.10 SOL fee transaction for user to sign in Phantom.
 * Returns serialized transaction; frontend signs and sends.
 */
export async function buildFeeTransaction(userWallet: PublicKey, connection?: Connection) {
  return createFeeTransaction(userWallet, connection ?? solanaConnection);
}

/**
 * Verifies that a fee transaction has been confirmed on-chain.
 * Checks: signature exists, transfers FEE_LAMPORTS from user to platform wallet.
 *
 * @param txSignature - Transaction signature (from Phantom after user signs & sends)
 * @param expectedPayer - User wallet that must be the fee payer
 * @param connection - Optional RPC override
 * @returns true if fee payment verified
 */
export async function verifyFeePayment(
  txSignature: string,
  expectedPayer: PublicKey,
  connection: Connection = solanaConnection
): Promise<boolean> {
  try {
    const sig = txSignature.trim();
    if (!sig) return false;

    const tx = await connection.getParsedTransaction(sig, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta) return false;
    if (tx.meta.err) return false;

    const accountKeys = tx.transaction.message.accountKeys;
    // In parsed messages the payer is accountKeys[0]
    if (!accountKeys || accountKeys.length === 0) return false;
    const payer = accountKeys[0];
    const payerPubkey = typeof payer === 'object' && 'pubkey' in payer
      ? (payer as { pubkey: PublicKey }).pubkey
      : new PublicKey(payer as unknown as string);

    if (!payerPubkey.equals(expectedPayer)) return false;

    const preBalances = tx.meta.preBalances;
    const postBalances = tx.meta.postBalances;
    if (!preBalances || !postBalances || preBalances.length !== postBalances.length) return false;

    const platformIndex = accountKeys.findIndex(
      (k) => {
        const pk = typeof k === 'object' && 'pubkey' in k
          ? (k as { pubkey: PublicKey }).pubkey
          : new PublicKey(k as unknown as string);
        return pk.equals(PLATFORM_WALLET_PUBKEY);
      }
    );
    if (platformIndex < 0) return false;

    const platformDelta = (postBalances[platformIndex] ?? 0) - (preBalances[platformIndex] ?? 0);
    return platformDelta >= FEE_LAMPORTS;
  } catch {
    return false;
  }
}
