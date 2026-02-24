import { Model, Optional } from 'sequelize';
export interface TokenAttributes {
    id: number;
    user_wallet: string;
    token_name: string;
    symbol: string;
    mint_address: string;
    supply: string;
    decimals: number;
    description: string | null;
    logo_uri: string | null;
    website: string | null;
    twitter: string | null;
    telegram: string | null;
    discord: string | null;
    metadata_uri: string | null;
    fee_paid: boolean;
    created_at: Date;
    updated_at: Date;
}
export type TokenCreationAttributes = Optional<TokenAttributes, 'id' | 'fee_paid' | 'created_at' | 'updated_at'>;
/**
 * Token model: stores launched SPL tokens.
 * user_wallet: Phantom wallet that created the token (mint authority).
 * mint_address: SPL token mint address.
 * supply: initial supply as string to avoid precision issues.
 * fee_paid: true after we verify the 0.10 SOL fee tx on-chain.
 */
export declare class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
    id: number;
    user_wallet: string;
    token_name: string;
    symbol: string;
    mint_address: string;
    supply: string;
    decimals: number;
    description: string | null;
    logo_uri: string | null;
    website: string | null;
    twitter: string | null;
    telegram: string | null;
    discord: string | null;
    metadata_uri: string | null;
    fee_paid: boolean;
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=Token.d.ts.map