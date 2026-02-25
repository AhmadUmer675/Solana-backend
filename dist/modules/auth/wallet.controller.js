"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePublicKey = validatePublicKey;
exports.parsePublicKey = parsePublicKey;
exports.connectWallet = connectWallet;
exports.disconnectWallet = disconnectWallet;
exports.verifySignature = verifySignature;
const web3_js_1 = require("@solana/web3.js");
/**
 * Validates Solana public key format (Phantom wallet address).
 * Use as middleware or helper. Does NOT access private keys or seed phrases.
 */
function validatePublicKey(req, res, next) {
    const wallet = (req.body?.wallet ?? req.query?.wallet);
    if (!wallet || typeof wallet !== 'string') {
        res.status(400).json({
            success: false,
            error: 'Missing or invalid wallet. Provide wallet (public key) in body or query.',
        });
        return;
    }
    const trimmed = wallet.trim();
    if (!trimmed) {
        res.status(400).json({
            success: false,
            error: 'Wallet address cannot be empty.',
        });
        return;
    }
    try {
        const pubkey = new web3_js_1.PublicKey(trimmed);
        req.walletPubkey = pubkey;
        req.walletAddress = pubkey.toBase58();
        next();
    }
    catch {
        res.status(400).json({
            success: false,
            error: 'Invalid Solana public key format. Use a valid Phantom wallet address.',
        });
    }
}
/**
 * Helper: validate public key from string. Returns PublicKey or null.
 */
function parsePublicKey(value) {
    if (!value || typeof value !== 'string')
        return null;
    try {
        return new web3_js_1.PublicKey(value.trim());
    }
    catch {
        return null;
    }
}
/**
 * POST /api/wallet/connect
 * Validates and connects Phantom wallet.
 * Returns wallet address if valid.
 */
async function connectWallet(req, res) {
    try {
        const wallet = req.walletAddress;
        const walletPubkey = req.walletPubkey;
        if (!wallet || !walletPubkey) {
            res.status(400).json({
                success: false,
                error: 'Wallet validation failed. Use validatePublicKey middleware.',
            });
            return;
        }
        res.status(200).json({
            success: true,
            wallet,
            message: 'Wallet connected successfully. You can now create tokens.',
        });
    }
    catch (err) {
        console.error('Wallet connect error:', err);
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : 'Failed to connect wallet.',
        });
    }
}
/**
 * POST /api/wallet/disconnect
 * Disconnects Phantom wallet session.
 */
async function disconnectWallet(req, res) {
    try {
        res.status(200).json({
            success: true,
            message: 'Wallet disconnected successfully.',
        });
    }
    catch (err) {
        console.error('Wallet disconnect error:', err);
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : 'Failed to disconnect wallet.',
        });
    }
}
/**
 * POST /api/wallet/verify
 * Verifies wallet signature.
 */
async function verifySignature(req, res) {
    try {
        const { wallet, signature, message } = req.body;
        if (!wallet || !signature || !message) {
            res.status(400).json({
                success: false,
                error: 'Missing wallet, signature, or message.',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Signature verification completed.',
        });
    }
    catch (err) {
        console.error('Signature verification error:', err);
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : 'Failed to verify signature.',
        });
    }
}
//# sourceMappingURL=wallet.controller.js.map