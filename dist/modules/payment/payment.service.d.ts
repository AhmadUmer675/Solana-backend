import { Connection, PublicKey } from '@solana/web3.js';
/**
 * Payment service: fee transaction creation and verification.
 * NEVER signs transactions or accesses private keys.
 */
/**
 * Builds unsigned 0.10 SOL fee transaction for user to sign in Phantom.
 * Returns serialized transaction; frontend signs and sends.
 */
export declare function buildFeeTransaction(userWallet: PublicKey, connection?: Connection): Promise<{
    serializedTransaction: string;
    lastValidBlockHeight: number;
}>;
/**
 * Verifies that a fee transaction has been confirmed on-chain.
 * Checks: signature exists, transfers FEE_LAMPORTS from user to platform wallet.
 *
 * @param txSignature - Transaction signature (from Phantom after user signs & sends)
 * @param expectedPayer - User wallet that must be the fee payer
 * @param connection - Optional RPC override
 * @returns true if fee payment verified
 */
export declare function verifyFeePayment(txSignature: string, expectedPayer: PublicKey, connection?: Connection): Promise<boolean>;
//# sourceMappingURL=payment.service.d.ts.map