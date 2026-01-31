import { Router } from 'express';
import { validatePublicKey } from '../auth/wallet.controller';
import * as tokenController from './token.controller';

const router = Router();

/**
 * POST /api/token/fee-transaction
 * Body: { wallet: string } — Phantom wallet public key
 * Returns: { success, serializedTransaction, lastValidBlockHeight }
 */
router.post(
  '/fee-transaction',
  validatePublicKey,
  tokenController.feeTransaction
);

/**
 * POST /api/token/create
 * Body: {
 *   wallet: string,
 *   tokenName: string,
 *   symbol: string,
 *   supply: string | number,
 *   feeTxSignature: string,
 *   mintPublicKey: string
 * }
 * Returns: { success, serializedTransaction, lastValidBlockHeight, mintAddress, tokenId }
 */
router.post('/create', validatePublicKey, tokenController.createToken);

export default router;
