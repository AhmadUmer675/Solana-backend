"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFeeTransaction = buildFeeTransaction;
exports.verifyFeePayment = verifyFeePayment;
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("../../config/solana");
const createTransaction_1 = require("../../utils/createTransaction");
/**
 * Payment service: fee transaction creation and verification.
 * NEVER signs transactions or accesses private keys.
 */
/**
 * Builds unsigned 0.10 SOL fee transaction for user to sign in Phantom.
 * Returns serialized transaction; frontend signs and sends.
 */
async function buildFeeTransaction(userWallet, connection) {
    return (0, createTransaction_1.createFeeTransaction)(userWallet, connection ?? solana_1.solanaConnection);
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
async function verifyFeePayment(txSignature, expectedPayer, connection = solana_1.solanaConnection) {
    try {
        const sig = txSignature.trim();
        if (!sig)
            return false;
        const tx = await connection.getParsedTransaction(sig, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
        });
        if (!tx || !tx.meta)
            return false;
        if (tx.meta.err)
            return false;
        const accountKeys = tx.transaction.message.accountKeys;
        // In parsed messages the payer is accountKeys[0]
        if (!accountKeys || accountKeys.length === 0)
            return false;
        const payer = accountKeys[0];
        const payerPubkey = typeof payer === 'object' && 'pubkey' in payer
            ? payer.pubkey
            : new web3_js_1.PublicKey(payer);
        if (!payerPubkey.equals(expectedPayer))
            return false;
        const preBalances = tx.meta.preBalances;
        const postBalances = tx.meta.postBalances;
        if (!preBalances || !postBalances || preBalances.length !== postBalances.length)
            return false;
        const platformIndex = accountKeys.findIndex((k) => {
            const pk = typeof k === 'object' && 'pubkey' in k
                ? k.pubkey
                : new web3_js_1.PublicKey(k);
            return pk.equals(solana_1.PLATFORM_WALLET_PUBKEY);
        });
        if (platformIndex < 0)
            return false;
        const platformDelta = (postBalances[platformIndex] ?? 0) - (preBalances[platformIndex] ?? 0);
        return platformDelta >= solana_1.FEE_LAMPORTS;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=payment.service.js.map