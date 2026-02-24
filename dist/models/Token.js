"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
/**
 * Token model: stores launched SPL tokens.
 * user_wallet: Phantom wallet that created the token (mint authority).
 * mint_address: SPL token mint address.
 * supply: initial supply as string to avoid precision issues.
 * fee_paid: true after we verify the 0.10 SOL fee tx on-chain.
 */
class Token extends sequelize_1.Model {
}
exports.Token = Token;
Token.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_wallet: {
        type: sequelize_1.DataTypes.STRING(44),
        allowNull: false,
    },
    token_name: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    symbol: {
        type: sequelize_1.DataTypes.STRING(16),
        allowNull: false,
    },
    mint_address: {
        type: sequelize_1.DataTypes.STRING(44),
        allowNull: false,
        unique: true,
    },
    supply: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
    },
    decimals: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 9,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    logo_uri: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    website: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    twitter: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    telegram: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    discord: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    metadata_uri: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    fee_paid: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'Token',
    tableName: 'tokens',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
//# sourceMappingURL=Token.js.map