import { Request, Response, NextFunction } from 'express';
import { PublicKey } from '@solana/web3.js';
/**
 * Validates Solana public key format (Phantom wallet address).
 * Use as middleware or helper. Does NOT access private keys or seed phrases.
 */
export declare function validatePublicKey(req: Request, res: Response, next: NextFunction): void;
/**
 * Helper: validate public key from string. Returns PublicKey or null.
 */
export declare function parsePublicKey(value: string | undefined): PublicKey | null;
/**
 * POST /api/wallet/connect
 * Validates and connects Phantom wallet.
 * Returns wallet address if valid.
 */
export declare function connectWallet(req: Request, res: Response): Promise<void>;
/**
 * POST /api/wallet/disconnect
 * Disconnects Phantom wallet session.
 */
export declare function disconnectWallet(req: Request, res: Response): Promise<void>;
/**
 * POST /api/wallet/verify
 * Verifies wallet signature.
 */
export declare function verifySignature(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=wallet.controller.d.ts.map