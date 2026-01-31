# Solana Token Launcher Backend

Production-ready backend for creating SPL tokens on Solana (similar to solanatokenlabs.io).

## Features

- ✅ Phantom wallet connection & validation
- ✅ 0.10 SOL fee payment (deducted from user wallet)
- ✅ SPL token creation with custom name, symbol, and supply
- ✅ Automatic token minting to user's wallet
- ✅ PostgreSQL database for token records
- ✅ Secure: Backend NEVER accesses private keys or seed phrases
- ✅ All transactions are unsigned - user signs with Phantom wallet

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL + Sequelize ORM
- Solana Web3.js
- SPL Token library

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=solana_token_launcher

# Solana RPC (mainnet, devnet, or custom)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Platform wallet that receives the 0.10 SOL fee (base58 public key)
# NEVER put private keys or seed phrases here
PLATFORM_WALLET_ADDRESS=YourPlatformWalletPublicKeyHere

# Optional
PORT=3000
NODE_ENV=development
```

### 3. Create Database

```bash
# Create PostgreSQL database
createdb solana_token_launcher

# Or using psql
psql -U postgres
CREATE DATABASE solana_token_launcher;
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### 1. Connect Wallet

**POST** `/api/wallet/connect`

Connect and validate Phantom wallet.

**Request:**
```json
{
  "wallet": "YourPhantomWalletPublicKey"
}
```

**Response:**
```json
{
  "success": true,
  "wallet": "YourPhantomWalletPublicKey",
  "message": "Wallet connected successfully. You can now create tokens."
}
```

### 2. Get Fee Transaction

**POST** `/api/token/fee-transaction`

Get unsigned 0.10 SOL fee transaction. User must sign and send this before creating token.

**Request:**
```json
{
  "wallet": "YourPhantomWalletPublicKey"
}
```

**Response:**
```json
{
  "success": true,
  "serializedTransaction": "base64_encoded_transaction",
  "lastValidBlockHeight": 123456789,
  "feeAmount": "0.10 SOL",
  "message": "Sign this transaction in Phantom to pay 0.10 SOL fee..."
}
```

**Frontend Flow:**
1. Deserialize the transaction
2. Sign with Phantom wallet
3. Send to Solana network
4. Get transaction signature
5. Use signature in `/api/token/create`

### 3. Create Token

**POST** `/api/token/create`

Create SPL token. Verifies fee payment, creates token, mints to user's wallet.

**Request:**
```json
{
  "wallet": "YourPhantomWalletPublicKey",
  "tokenName": "My Awesome Token",
  "symbol": "MAT",
  "supply": 1000000,
  "feeTxSignature": "transaction_signature_from_step_2",
  "mintPublicKey": "mint_keypair_public_key"
}
```

**Response:**
```json
{
  "success": true,
  "serializedTransaction": "base64_encoded_transaction",
  "lastValidBlockHeight": 123456789,
  "mintAddress": "TokenMintAddress",
  "tokenId": 1,
  "feePaid": true,
  "message": "Fee verified! Sign this transaction..."
}
```

**Frontend Flow:**
1. Generate mint keypair (keep secret key safe)
2. Send mint public key to backend
3. Deserialize the transaction
4. Sign with user wallet + mint keypair
5. Send to Solana network
6. Token appears in Phantom wallet automatically!

## Token Creation Flow

```
1. User connects Phantom wallet
   ↓
2. Frontend calls POST /api/token/fee-transaction
   ↓
3. User signs fee transaction (0.10 SOL deducted)
   ↓
4. Frontend calls POST /api/token/create with fee signature
   ↓
5. Backend verifies fee payment
   ↓
6. Backend creates unsigned token transaction
   ↓
7. User signs token transaction (wallet + mint keypair)
   ↓
8. Token appears in Phantom wallet! 🎉
```

## Security

- ✅ **No Private Keys**: Backend never accesses user private keys or seed phrases
- ✅ **Unsigned Transactions**: All transactions are unsigned - user signs with Phantom
- ✅ **Fee Verification**: Backend verifies fee payment on-chain before creating token
- ✅ **Wallet Validation**: All wallet addresses are validated before processing

## Database Schema

### tokens Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_wallet | STRING(44) | Phantom wallet address |
| token_name | STRING(64) | Token name |
| symbol | STRING(16) | Token symbol |
| mint_address | STRING(44) | SPL token mint address (unique) |
| supply | STRING(32) | Initial supply |
| fee_paid | BOOLEAN | Fee payment status |
| created_at | DATE | Creation timestamp |
| updated_at | DATE | Update timestamp |

## Development

```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Development server
npm run dev

# Build for production
npm run build
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use production PostgreSQL database
3. Use mainnet Solana RPC URL
4. Set secure `PLATFORM_WALLET_ADDRESS`
5. Run migrations: `npm run db:migrate`
6. Build: `npm run build`
7. Start: `npm start`

## Notes

- Token decimals are fixed at 9 (standard for Solana)
- Mint authority is set to user wallet (user controls token)
- Initial supply is minted to user's associated token account (ATA)
- Token automatically appears in Phantom wallet after creation
- Fee (0.10 SOL) is deducted when user signs and sends the fee transaction

## License

ISC
