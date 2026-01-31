# Localhost Testing Guide

## Server Start Karna

### Step 1: Dependencies Install Karein
```bash
npm install
```

### Step 2: Database Setup
```bash
# PostgreSQL database create karein (agar nahi hai)
createdb solana_token_launcher

# Migrations run karein
npm run db:migrate
```

### Step 3: .env File Check Karein
`.env` file mein ye values honi chahiye:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=solana_token_launcher
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PLATFORM_WALLET_ADDRESS=YourWalletPublicKey
PORT=3000
NODE_ENV=development
```

### Step 4: Server Start Karein
```bash
# Development mode (auto-reload)
npm run dev

# Ya production build
npm run build
npm start
```

Server `http://localhost:3000` par start ho jayega.

---

## Testing Methods

### Method 1: Browser (Simple Check)

**Health Check:**
```
http://localhost:3000/health
```

Browser mein ye URL open karein - `{"status":"ok","service":"solana-token-launcher"}` aana chahiye.

---

### Method 2: Postman (Recommended)

#### 1. Wallet Connect Test

**Request:**
- Method: `POST`
- URL: `http://localhost:3000/api/wallet/connect`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
    "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "message": "Wallet connected successfully. You can now create tokens."
}
```

#### 2. Fee Transaction Test

**Request:**
- Method: `POST`
- URL: `http://localhost:3000/api/token/fee-transaction`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
    "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "serializedTransaction": "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAED...",
  "lastValidBlockHeight": 123456789,
  "feeAmount": "0.10 SOL",
  "message": "Sign this transaction in Phantom to pay 0.10 SOL fee..."
}
```

#### 3. Create Token Test

**Request:**
- Method: `POST`
- URL: `http://localhost:3000/api/token/create`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
    "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "tokenName": "Test Token",
    "symbol": "TEST",
    "supply": 1000000,
    "feeTxSignature": "5j7s8K9L0mN1oP2qR3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0aB1cD2eF",
    "mintPublicKey": "9xKYtg3CW88d98TXJSDpbD6jBkheTqA84TZRuJosgAsV"
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "serializedTransaction": "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAED...",
  "lastValidBlockHeight": 123456789,
  "mintAddress": "9xKYtg3CW88d98TXJSDpbD6jBkheTqA84TZRuJosgAsV",
  "tokenId": 1,
  "feePaid": true,
  "message": "Fee verified! Sign this transaction..."
}
```

---

### Method 3: cURL (Terminal/Command Prompt)

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Wallet Connect
```bash
curl -X POST http://localhost:3000/api/wallet/connect \
  -H "Content-Type: application/json" \
  -d "{\"wallet\":\"7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU\"}"
```

#### Fee Transaction
```bash
curl -X POST http://localhost:3000/api/token/fee-transaction \
  -H "Content-Type: application/json" \
  -d "{\"wallet\":\"7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU\"}"
```

#### Create Token
```bash
curl -X POST http://localhost:3000/api/token/create \
  -H "Content-Type: application/json" \
  -d "{\"wallet\":\"7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU\",\"tokenName\":\"Test Token\",\"symbol\":\"TEST\",\"supply\":1000000,\"feeTxSignature\":\"5j7s8K9L0mN1oP2qR3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0aB1cD2eF\",\"mintPublicKey\":\"9xKYtg3CW88d98TXJSDpbD6jBkheTqA84TZRuJosgAsV\"}"
```

---

### Method 4: JavaScript/Fetch (Browser Console)

Browser console mein ye code run karein:

```javascript
// 1. Health Check
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(console.log);

// 2. Wallet Connect
fetch('http://localhost:3000/api/wallet/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  })
})
  .then(r => r.json())
  .then(console.log);

// 3. Fee Transaction
fetch('http://localhost:3000/api/token/fee-transaction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  })
})
  .then(r => r.json())
  .then(console.log);
```

---

## Common Errors & Solutions

### Error: "Cannot connect to database"
**Solution:**
- PostgreSQL service check karein: `pg_isready` ya `psql -U postgres`
- `.env` mein DB credentials verify karein
- Database create karein: `createdb solana_token_launcher`

### Error: "PLATFORM_WALLET_ADDRESS is not a valid Solana public key"
**Solution:**
- `.env` mein valid Solana public key dalen (Phantom wallet se)
- Quotes remove karein agar hai
- Extra spaces remove karein

### Error: "Port 3000 already in use"
**Solution:**
- Port change karein `.env` mein: `PORT=3001`
- Ya existing process kill karein:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:3000 | xargs kill
  ```

### Error: "CORS error" (Frontend se call karte waqt)
**Solution:**
- `src/app.ts` mein CORS already enabled hai
- Agar specific origin allow karna hai, update karein:
  ```typescript
  app.use(cors({
    origin: 'http://localhost:5173' // Your frontend URL
  }));
  ```

---

## Quick Test Script

`test-api.js` file bana kar ye code dalen:

```javascript
const BASE_URL = 'http://localhost:3000';
const TEST_WALLET = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';

async function testAPI() {
  try {
    // 1. Health Check
    console.log('1. Testing Health Check...');
    const health = await fetch(`${BASE_URL}/health`);
    console.log('Health:', await health.json());

    // 2. Wallet Connect
    console.log('\n2. Testing Wallet Connect...');
    const connect = await fetch(`${BASE_URL}/api/wallet/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: TEST_WALLET })
    });
    console.log('Connect:', await connect.json());

    // 3. Fee Transaction
    console.log('\n3. Testing Fee Transaction...');
    const fee = await fetch(`${BASE_URL}/api/token/fee-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: TEST_WALLET })
    });
    const feeData = await fee.json();
    console.log('Fee Transaction:', feeData);

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
```

Run karein:
```bash
node test-api.js
```

---

## Server Logs Check Karna

Server start hone par ye logs dikhne chahiye:
```
Server listening on port 3000
```

Agar database connection successful hai, to koi error nahi aayega.

---

## Database Check Karna

PostgreSQL mein directly check karein:
```bash
psql -U postgres -d solana_token_launcher

# Tables check karein
\dt

# Tokens table check karein
SELECT * FROM tokens;
```

---

## Summary

1. ✅ Server start: `npm run dev`
2. ✅ Health check: Browser mein `http://localhost:3000/health`
3. ✅ Postman se test karein ya browser console se
4. ✅ Logs check karein terminal mein
5. ✅ Database verify karein agar token create kiya

**Note:** Real token create karne ke liye valid Phantom wallet address aur Solana network connection chahiye!
