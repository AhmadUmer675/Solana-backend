import { Request, Response, NextFunction } from 'express';
import { PublicKey } from '@solana/web3.js';

/**
 * Validates Solana public key format (Phantom wallet address).
 * Use as middleware or helper. Does NOT access private keys or seed phrases.
 */
export function validatePublicKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const wallet = (req.body?.wallet ?? req.query?.wallet) as string | undefined;

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
    const pubkey = new PublicKey(trimmed);
    (req as any).walletPubkey = pubkey;
    (req as any).walletAddress = pubkey.toBase58();
    next();
  } catch {
    res.status(400).json({
      success: false,
      error: 'Invalid Solana public key format. Use a valid Phantom wallet address.',
    });
  }
}

/**
 * Helper: validate public key from string. Returns PublicKey or null.
 */
export function parsePublicKey(value: string | undefined): PublicKey | null {
  if (!value || typeof value !== 'string') return null;
  try {
    return new PublicKey(value.trim());
  } catch {
    return null;
  }
}

/**
 * POST /api/wallet/connect
 * Validates and connects Phantom wallet.
 * Returns wallet address if valid.
 */
export async function connectWallet(req: Request, res: Response): Promise<void> {
  try {
    const wallet = (req as any).walletAddress as string;
    const walletPubkey = (req as any).walletPubkey as PublicKey;

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
  } catch (err) {
    console.error('Wallet connect error:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to connect wallet.',
    });
  }
}
