"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.feeTransaction = feeTransaction;
exports.createToken = createToken;
const tokenService = __importStar(require("./token.service"));
const wallet_controller_1 = require("../auth/wallet.controller");
/**
 * POST /api/token/fee-transaction
 * Body: { wallet: string }
 * Returns unsigned 0.10 SOL transfer tx for frontend to sign with Phantom.
 */
async function feeTransaction(req, res) {
    try {
        const wallet = req.walletPubkey;
        if (!wallet) {
            res.status(400).json({
                success: false,
                error: 'Wallet is required. Use validatePublicKey middleware.',
            });
            return;
        }
        const result = await tokenService.createFeeTx(wallet);
        res.status(200).json({
            success: true,
            serializedTransaction: result.serializedTransaction,
            lastValidBlockHeight: result.lastValidBlockHeight,
            feeAmount: '0.10 SOL',
            message: 'Sign this transaction in Phantom to pay 0.10 SOL fee. After sending, use the transaction signature to create your token.',
        });
    }
    catch (err) {
        console.error('Fee transaction error:', err);
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create fee transaction.',
        });
    }
}
/**
 * POST /api/token/create
 * Body: { wallet, tokenName, symbol, supply, feeTxSignature, mintPublicKey }
 * Verifies fee, creates unsigned token-mint tx, stores token in DB.
 */
async function createToken(req, res) {
    try {
        const { tokenName, symbol, supply, decimals, description, logoUri, website, twitter, telegram, discord, feeTxSignature, mintPublicKey } = req.body ?? {};
        const wallet = req.walletAddress;
        if (!wallet) {
            res.status(400).json({
                success: false,
                error: 'Wallet is required. Use validatePublicKey middleware.',
            });
            return;
        }
        const mintPubkey = (0, wallet_controller_1.parsePublicKey)(mintPublicKey);
        if (!mintPubkey) {
            res.status(400).json({
                success: false,
                error: 'Valid mintPublicKey is required. Generate a keypair on frontend and send the public key.',
            });
            return;
        }
        const result = await tokenService.createToken({
            wallet,
            tokenName,
            symbol,
            supply,
            decimals,
            description,
            logoUri,
            website,
            twitter,
            telegram,
            discord,
            feeTxSignature,
            mintPublicKey: mintPubkey.toBase58(),
        });
        res.status(200).json({
            success: true,
            serializedTransaction: result.serializedTransaction,
            lastValidBlockHeight: result.lastValidBlockHeight,
            mintAddress: result.mintAddress,
            tokenId: result.tokenId,
            feePaid: true,
            message: 'Fee verified! Sign this transaction in Phantom (wallet + mint keypair) and send. Your token will appear in your wallet automatically.',
        });
    }
    catch (err) {
        console.error('Create token error:', err);
        const msg = err instanceof Error ? err.message : 'Failed to create token.';
        const status = msg.includes('verified') || msg.includes('required') ? 400 : 500;
        res.status(status).json({ success: false, error: msg });
    }
}
//# sourceMappingURL=token.controller.js.map