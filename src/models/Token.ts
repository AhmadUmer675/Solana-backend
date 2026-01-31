import {
  Model,
  DataTypes,
  Optional,
  CreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db';

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

export type TokenCreationAttributes = Optional<
  TokenAttributes,
  'id' | 'fee_paid' | 'created_at' | 'updated_at'
>;

/**
 * Token model: stores launched SPL tokens.
 * user_wallet: Phantom wallet that created the token (mint authority).
 * mint_address: SPL token mint address.
 * supply: initial supply as string to avoid precision issues.
 * fee_paid: true after we verify the 0.10 SOL fee tx on-chain.
 */
export class Token
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes
{
  declare id: number;
  declare user_wallet: string;
  declare token_name: string;
  declare symbol: string;
  declare mint_address: string;
  declare supply: string;
  declare decimals: number;
  declare description: string | null;
  declare logo_uri: string | null;
  declare website: string | null;
  declare twitter: string | null;
  declare telegram: string | null;
  declare discord: string | null;
  declare metadata_uri: string | null;
  declare fee_paid: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_wallet: {
      type: DataTypes.STRING(44),
      allowNull: false,
    },
    token_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    mint_address: {
      type: DataTypes.STRING(44),
      allowNull: false,
      unique: true,
    },
    supply: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 9,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo_uri: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    telegram: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    discord: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    metadata_uri: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    fee_paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
