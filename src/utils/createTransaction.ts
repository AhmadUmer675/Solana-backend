import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
} from '@solana/spl-token';
import { createMetadataAccountV3 } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsPublicKey, toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// Mint account size in bytes (standard SPL token mint)
const MINT_SIZE = 82;
import {
  solanaConnection,
  PLATFORM_WALLET_PUBKEY,
  FEE_LAMPORTS,
} from '../config/solana';

/**
 * Creates an UNSIGNED SOL transfer transaction (fee: 0.10 SOL).
 * User signs with Phantom on frontend. Backend NEVER signs or holds private keys.
 *
 * @param fromWallet - User's wallet public key (Phantom)
 * @param connection - Optional override; defaults to config connection
 * @returns Base64-encoded serialized transaction + lastValidBlockHeight
 */
export async function createFeeTransaction(
  fromWallet: PublicKey,
  connection: Connection = solanaConnection
): Promise<{ serializedTransaction: string; lastValidBlockHeight: number }> {
  const { value: { blockhash, lastValidBlockHeight } } =
    await connection.getLatestBlockhashAndContext('confirmed');

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: PLATFORM_WALLET_PUBKEY,
      lamports: FEE_LAMPORTS,
    })
  );

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
export async function createTokenMintTransaction(
  params: CreateTokenTransactionParams
): Promise<{ serializedTransaction: string; lastValidBlockHeight: number }> {
  const {
    userWallet,
    mintPublicKey,
    decimals = 9,
    supply,
    connection = solanaConnection,
  } = params;

  const rent = await getMinimumBalanceForRentExemptMint(connection);

  const ata = getAssociatedTokenAddressSync(
    mintPublicKey,
    userWallet,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: userWallet,
    newAccountPubkey: mintPublicKey,
    lamports: rent,
    space: MINT_SIZE,
    programId: TOKEN_PROGRAM_ID,
  });

  const initMintIx = createInitializeMintInstruction(
    mintPublicKey,
    decimals,
    userWallet,
    null,
    TOKEN_PROGRAM_ID
  );

  const createAtaIx = createAssociatedTokenAccountInstruction(
    userWallet,
    ata,
    userWallet,
    mintPublicKey,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const mintToIx = createMintToInstruction(
    mintPublicKey,
    ata,
    userWallet,
    supply,
    [],
    TOKEN_PROGRAM_ID
  );

  const { value: { blockhash, lastValidBlockHeight } } =
    await connection.getLatestBlockhashAndContext('confirmed');

  const tx = new Transaction()
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
