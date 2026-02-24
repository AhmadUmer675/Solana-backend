"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeeTransaction = createFeeTransaction;
exports.createTokenMintTransaction = createTokenMintTransaction;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
// Mint account size in bytes (standard SPL token mint)
const MINT_SIZE = 82;
const solana_1 = require("../config/solana");
/**
 * Creates an UNSIGNED SOL transfer transaction (fee: 0.10 SOL).
 * User signs with Phantom on frontend. Backend NEVER signs or holds private keys.
 *
 * @param fromWallet - User's wallet public key (Phantom)
 * @param connection - Optional override; defaults to config connection
 * @returns Base64-encoded serialized transaction + lastValidBlockHeight
 */
async function createFeeTransaction(fromWallet, connection = solana_1.solanaConnection) {
    const { value: { blockhash, lastValidBlockHeight } } = await connection.getLatestBlockhashAndContext('confirmed');
    const tx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
        fromPubkey: fromWallet,
        toPubkey: solana_1.PLATFORM_WALLET_PUBKEY,
        lamports: solana_1.FEE_LAMPORTS,
    }));
    tx.recentBlockhash = blockhash;
    tx.feePayer = fromWallet;
    // Serialize unsigned; frontend signs with Phantom
    const serialized = tx.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
    });
    return {
        serializedTransaction: serialized.toString('base64'),
        lastValidBlockHeight,
    };
}
/**
 * Creates an UNSIGNED SPL token mint transaction.
 * Instructions: createAccount (mint) -> initializeMint -> createAssociatedTokenAccount -> mintTo.
 * Signers: user (payer + mint authority) + mint keypair. Both sign on frontend; we never touch keys.
 *
 * @param params - User wallet, mint pubkey, supply, etc.
 * @returns Base64-encoded serialized transaction + lastValidBlockHeight
 */
async function createTokenMintTransaction(params) {
    const { userWallet, mintPublicKey, decimals = 9, supply, connection = solana_1.solanaConnection, } = params;
    const rent = await (0, spl_token_1.getMinimumBalanceForRentExemptMint)(connection);
    const ata = (0, spl_token_1.getAssociatedTokenAddressSync)(mintPublicKey, userWallet, false, spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
    const createAccountIx = web3_js_1.SystemProgram.createAccount({
        fromPubkey: userWallet,
        newAccountPubkey: mintPublicKey,
        lamports: rent,
        space: MINT_SIZE,
        programId: spl_token_1.TOKEN_PROGRAM_ID,
    });
    const initMintIx = (0, spl_token_1.createInitializeMintInstruction)(mintPublicKey, decimals, userWallet, null, spl_token_1.TOKEN_PROGRAM_ID);
    const createAtaIx = (0, spl_token_1.createAssociatedTokenAccountInstruction)(userWallet, ata, userWallet, mintPublicKey, spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
    const mintToIx = (0, spl_token_1.createMintToInstruction)(mintPublicKey, ata, userWallet, supply, [], spl_token_1.TOKEN_PROGRAM_ID);
    const { value: { blockhash, lastValidBlockHeight } } = await connection.getLatestBlockhashAndContext('confirmed');
    const tx = new web3_js_1.Transaction()
        .add(createAccountIx, initMintIx, createAtaIx, mintToIx);
    tx.recentBlockhash = blockhash;
    tx.feePayer = userWallet;
    const serialized = tx.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
    });
    return {
        serializedTransaction: serialized.toString('base64'),
        lastValidBlockHeight,
    };
}
//# sourceMappingURL=createTransaction.js.map