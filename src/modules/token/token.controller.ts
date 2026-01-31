import { Request, Response } from 'express';
import * as tokenService from './token.service';
import { parsePublicKey } from '../auth/wallet.controller';

/**
 * POST /api/token/fee-transaction
 * Body: { wallet: string }
 * Returns unsigned 0.10 SOL transfer tx for frontend to sign with Phantom.
 */
export async function feeTransaction(req: Request, res: Response): Promise<void> {
  try {
    const wallet = (req as any).walletPubkey as import('@solana/web3.js').PublicKey;
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
      message:
        'Sign this transaction in Phantom to pay 0.10 SOL fee. After sending, use the transaction signature to create your token.',
    });
  } catch (err) {
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
export async function createToken(req: Request, res: Response): Promise<void> {
  try {
    const { 
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
      mintPublicKey 
    } = req.body ?? {};
    const wallet = (req as any).walletAddress as string | undefined;

    if (!wallet) {
      res.status(400).json({
        success: false,
        error: 'Wallet is required. Use validatePublicKey middleware.',
      });
      return;
    }

    const mintPubkey = parsePublicKey(mintPublicKey);
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
      message:
        'Fee verified! Sign this transaction in Phantom (wallet + mint keypair) and send. Your token will appear in your wallet automatically.',
    });
  } catch (err) {
    console.error('Create token error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create token.';
    const status = msg.includes('verified') || msg.includes('required') ? 400 : 500;
    res.status(status).json({ success: false, error: msg });
  }
}
