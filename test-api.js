/**
 * Quick API Test Script
 * Run: node test-api.js
 */

const BASE_URL = 'http://localhost:3000';
const TEST_WALLET = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'; // Replace with your test wallet

async function testAPI() {
  console.log('🚀 Testing Solana Token Launcher API...\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Testing Health Check...');
    const health = await fetch(`${BASE_URL}/health`);
    const healthData = await health.json();
    console.log('✅ Health:', healthData);
    console.log('');

    // 2. Wallet Connect
    console.log('2️⃣  Testing Wallet Connect...');
    const connect = await fetch(`${BASE_URL}/api/wallet/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: TEST_WALLET })
    });
    const connectData = await connect.json();
    if (connectData.success) {
      console.log('✅ Wallet Connected:', connectData.wallet);
    } else {
      console.log('❌ Error:', connectData.error);
    }
    console.log('');

    // 3. Fee Transaction
    console.log('3️⃣  Testing Fee Transaction...');
    const fee = await fetch(`${BASE_URL}/api/token/fee-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: TEST_WALLET })
    });
    const feeData = await fee.json();
    if (feeData.success) {
      console.log('✅ Fee Transaction Created');
      console.log('   Fee Amount:', feeData.feeAmount);
      console.log('   Transaction Length:', feeData.serializedTransaction?.length, 'chars');
    } else {
      console.log('❌ Error:', feeData.error);
    }
    console.log('');

    console.log('✨ All tests completed!\n');
    console.log('📝 Next Steps:');
    console.log('   - Use Postman for full testing');
    console.log('   - Or use browser console with fetch()');
    console.log('   - Check TESTING.md for detailed guide');

  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Server is running: npm run dev');
    console.log('   2. Server is on: http://localhost:3000');
    console.log('   3. Database is connected');
  }
}

testAPI();
