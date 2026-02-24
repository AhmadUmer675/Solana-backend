import { Router } from 'express';
import { validatePublicKey } from './wallet.controller';
import * as walletController from './wallet.controller';

const router = Router();

/**
 * POST /api/wallet/connect
 * Body: { wallet: string } — Phantom wallet public key
 * Returns: { success, wallet, message }
 * Validates wallet connection (Phantom-compatible)
 */
router.post('/connect', validatePublicKey, walletController.connectWallet);

/**
 * POST /api/wallet/disconnect
 * Optional symmetry endpoint; no validation needed.
 */
router.post('/disconnect', walletController.disconnectWallet);

/**
 * POST /api/wallet/verify
 * Stubbed signature verification.
 */
router.post('/verify', walletController.verifySignature);

export default router;
