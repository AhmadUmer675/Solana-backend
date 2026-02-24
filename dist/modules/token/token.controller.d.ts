import { Request, Response } from 'express';
/**
 * POST /api/token/fee-transaction
 * Body: { wallet: string }
 * Returns unsigned 0.10 SOL transfer tx for frontend to sign with Phantom.
 */
export declare function feeTransaction(req: Request, res: Response): Promise<void>;
/**
 * POST /api/token/create
 * Body: { wallet, tokenName, symbol, supply, feeTxSignature, mintPublicKey }
 * Verifies fee, creates unsigned token-mint tx, stores token in DB.
 */
export declare function createToken(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=token.controller.d.ts.map