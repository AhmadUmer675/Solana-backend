import 'dotenv/config';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import tokenRoutes from './modules/token/token.routes';
import walletRoutes from './modules/auth/wallet.routes';

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '64kb' }));

// API Info endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: 'Solana Token Launcher API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      wallet: {
        connect: 'POST /api/wallet/connect',
        description: 'Connect and validate Phantom wallet',
        body: { wallet: 'string (Phantom wallet public key)' }
      },
      token: {
        feeTransaction: 'POST /api/token/fee-transaction',
        description: 'Get unsigned 0.10 SOL fee transaction',
        body: { wallet: 'string (Phantom wallet public key)' },
        create: 'POST /api/token/create',
      }
    },
    documentation: 'See README.md or API.md for detailed documentation'
  });
});

app.use('/api/wallet', walletRoutes);
app.use('/api/token', tokenRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'solana-token-launcher' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

export default app;
