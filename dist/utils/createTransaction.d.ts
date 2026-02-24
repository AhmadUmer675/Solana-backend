import { Connection, PublicKey } from '@solana/web3.js';
/**
 * Creates an UNSIGNED SOL transfer transaction (fee: 0.10 SOL).
 * User signs with Phantom on frontend. Backend NEVER signs or holds private keys.
 *
 * @param fromWallet - User's wallet public key (Phantom)
 * @param connection - Optional override; defaults to config connection
 * @returns Base64-encoded serialized transaction + lastValidBlockHeight
 */
export declare function createFeeTransaction(fromWallet: PublicKey, connection?: Connection): Promise<{
    serializedTransaction: string;
    lastValidBlockHeight: number;
}>;
export interface CreateTokenTransactionParams {
    /** User wallet (payer + mint authority). */
    userWallet: PublicKey;
    /** Mint account public key (frontend generates keypair, sends pubkey only). */
    mintPublicKey: PublicKey;
    /** Token decimals (default 9). */
    decimals?: number;
    /** Initial supply in token base units (e.g. 1e9 for 1 token with 9 decimals). */
    supply: bigint;
    /** Optional RPC connection override. */
    connection?: Connection;
}
/**
 * Creates an UNSIGNED SPL token mint transaction.
 * Instructions: createAccount (mint) -> initializeMint -> createAssociatedTokenAccount -> mintTo.
 * Signers: user (payer + mint authority) + mint keypair. Both sign on frontend; we never touch keys.
 *
 * @param params - User wallet, mint pubkey, supply, etc.
 * @returns Base64-encoded serialized transaction + lastValidBlockHeight
 */
export declare function createTokenMintTransaction(params: CreateTokenTransactionParams): Promise<{
    serializedTransaction: string;
    lastValidBlockHeight: number;
}>;
//# sourceMappingURL=createTransaction.d.ts.map