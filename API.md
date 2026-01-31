# API Reference

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Connect Wallet

**POST** `/wallet/connect`

Validates and connects Phantom wallet.

**Request Body:**
```json
{
  "wallet": "PhantomWalletPublicKey"
}
```

**Response (200):**
```json
{
  "success": true,
  "wallet": "PhantomWalletPublicKey",
  "message": "Wallet connected successfully. You can now create tokens."
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Invalid Solana public key format..."
}
```

---

### 2. Get Fee Transaction

**POST** `/token/fee-transaction`

Get unsigned 0.10 SOL fee transaction. User must sign and send this transaction first.

**Request Body:**
```json
{
  "wallet": "PhantomWalletPublicKey"
}
```

**Response (200):**
```json
{
  "success": true,
  "serializedTransaction": "base64_encoded_transaction",
  "lastValidBlockHeight": 123456789,
  "feeAmount": "0.10 SOL",
  "message": "Sign this transaction in Phantom to pay 0.10 SOL fee..."
}
```

**Frontend Steps:**
1. Deserialize `serializedTransaction` (base64 → Buffer)
2. Sign with Phantom wallet
3. Send to Solana network
4. Save the transaction signature
5. Use signature in `/token/create`

---

### 3. Create Token

**POST** `/token/create`

Create SPL token. Verifies fee payment, creates token mint, mints tokens to user's wallet.

**Request Body:**
```json
{
  "wallet": "PhantomWalletPublicKey",
  "tokenName": "My Awesome Token",
  "symbol": "MAT",
  "supply": 1000000,
  "feeTxSignature": "transaction_signature_from_fee_payment",
  "mintPublicKey": "mint_keypair_public_key"
}
```

**Parameters:**
- `wallet`: User's Phantom wallet public key
- `tokenName`: Token name (max 64 chars)
- `symbol`: Token symbol (max 16 chars, auto-uppercased)
- `supply`: Initial supply (number, e.g. 1000000 = 1M tokens)
- `feeTxSignature`: Transaction signature from fee payment step
- `mintPublicKey`: Public key of mint keypair (generate on frontend)

**Response (200):**
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

**Frontend Steps:**
1. Generate mint keypair (keep secret key safe!)
2. Send mint public key to backend
3. Deserialize `serializedTransaction`
4. Sign with:
   - User wallet (Phantom)
   - Mint keypair (from step 1)
5. Send to Solana network
6. Token appears in Phantom wallet automatically!

**Error (400):**
```json
{
  "success": false,
  "error": "Fee payment could not be verified..."
}
```

---

## Complete Flow Example

### Step 1: Connect Wallet
```javascript
const response = await fetch('http://localhost:3000/api/wallet/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ wallet: userWalletPublicKey })
});
```

### Step 2: Get Fee Transaction
```javascript
const feeResponse = await fetch('http://localhost:3000/api/token/fee-transaction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ wallet: userWalletPublicKey })
});

const { serializedTransaction } = await feeResponse.json();
```

### Step 3: Sign & Send Fee Transaction
```javascript
import { Transaction } from '@solana/web3.js';

// Deserialize
const feeTx = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

// Sign with Phantom
const signedFeeTx = await window.solana.signTransaction(feeTx);

// Send
const feeSignature = await connection.sendRawTransaction(signedFeeTx.serialize());
await connection.confirmTransaction(feeSignature);
```

### Step 4: Create Token
```javascript
import { Keypair } from '@solana/web3.js';

// Generate mint keypair
const mintKeypair = Keypair.generate();
const mintPublicKey = mintKeypair.publicKey.toBase58();

// Create token
const createResponse = await fetch('http://localhost:3000/api/token/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet: userWalletPublicKey,
    tokenName: 'My Token',
    symbol: 'MTK',
    supply: 1000000,
    feeTxSignature: feeSignature,
    mintPublicKey: mintPublicKey
  })
});

const { serializedTransaction: tokenTx } = await createResponse.json();
```

### Step 5: Sign & Send Token Transaction
```javascript
// Deserialize
const tokenTransaction = Transaction.from(Buffer.from(tokenTx, 'base64'));

// Sign with Phantom + mint keypair
const signedTokenTx = await window.solana.signTransaction(tokenTransaction);
signedTokenTx.partialSign(mintKeypair);

// Send
const tokenSignature = await connection.sendRawTransaction(signedTokenTx.serialize());
await connection.confirmTransaction(tokenSignature);

// Token now appears in Phantom wallet! 🎉
```

---

## Notes

- All transactions are **unsigned** - backend never signs
- User must sign all transactions with Phantom wallet
- Fee (0.10 SOL) is deducted when user signs and sends fee transaction
- Token automatically appears in Phantom after creation
- Mint authority = user wallet (user controls the token)
- Token decimals = 9 (standard for Solana)
