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

export default router;
