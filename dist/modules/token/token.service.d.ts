import { PublicKey } from '@solana/web3.js';
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
export declare function createFeeTx(userWallet: PublicKey): Promise<FeeTransactionResult>;
/**
 * Creates unsigned SPL token mint transaction, verifies fee, and stores token in DB.
 * Throws on validation or verification failure.
 */
export declare function createToken(input: CreateTokenInput): Promise<CreateTokenResult>;
//# sourceMappingURL=token.service.d.ts.map