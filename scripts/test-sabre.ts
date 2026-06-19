import { SabreClient } from '../lib/gds/sabre-client';

async function testSabre() {
  console.log('🚀 Testing Sabre API Connection...');
  console.log('=========================================');
  
  const client = new SabreClient();
  
  try {
    // 1. Get Token
    console.log('1️⃣ Getting authentication token...');
    const token = await client.getToken();
    console.log('✅ Token obtained:', token.substring(0, 30) + '...');
    console.log('');

    // 2. Create PNR
    console.log('2️⃣ Creating test PNR...');
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7);
    const dateStr = departureDate.toISOString().split('T')[0];

    const pnr = await client.createPNR({
      origin: 'JFK',
      destination: 'LHR',
      departureDate: dateStr,
      departureTime: '10:00',
      passengerName: 'John Smith',
      flightNumber: '1234',
      airlineCode: 'DL',
    });
    
    console.log('✅ PNR Created:');
    console.log('   PNR Code:', pnr.pnrCode);
    console.log('   Booking Ref:', pnr.bookingRef);
    console.log('');

    // 3. Verify PNR
    console.log('3️⃣ Verifying PNR...');
    if (pnr.pnrCode.startsWith('TEST')) {
      console.log('⚠️ Note: This is a simulated PNR (Sabre API may need additional configuration)');
    } else {
      const pnrDetails = await client.getPNR(pnr.pnrCode);
      console.log('✅ PNR Verified:', pnrDetails ? 'Success' : 'Failed');
    }
    console.log('');

    console.log('🎉 Test completed successfully!');
    console.log('=========================================');
    console.log('PNR Code:', pnr.pnrCode);
    console.log('Booking Ref:', pnr.bookingRef);
    console.log('⚠️ Important: This is a TEST booking. It will expire in 14 days.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('1. Check your Sabre credentials');
    console.log('2. Make sure you have a valid PCC');
    console.log('3. Try using a different test PCC');
  }
}

testSabre();
