// app/api/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test endpoint called');
    
    // Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    };
    
    console.log('📦 Environment check:', envCheck);
    
    const supabase = await createClient();
    
    // Test 1: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return NextResponse.json({ 
        success: false,
        test: 'auth',
        error: authError.message,
        env: envCheck
      }, { status: 401 });
    }
    
    // Test 2: Try to insert a test flight
    const testBookingRef = `TEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const testPnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data: insertData, error: insertError } = await supabase
      .from('flights')
      .insert({
        user_id: user.id,
        pnr_code: testPnr,
        booking_ref: testBookingRef,
        airline: 'Test Airline',
        airline_code: 'TA',
        flight_number: 'TEST123',
        flight_date: new Date().toISOString().split('T')[0],
        flight_time: '12:00',
        origin: 'Test City',
        origin_airport: 'TST',
        destination: 'Test Destination',
        destination_airport: 'DST',
        passenger1_name: 'Test User',
        contact_email: user.email,
        status: 'confirmed',
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return NextResponse.json({
        success: false,
        test: 'insert',
        error: insertError.message,
        details: insertError,
        env: envCheck,
        user: { id: user.id, email: user.email }
      }, { status: 500 });
    }
    
    // Test 3: Count flights
    const { data: countData, error: countError } = await supabase
      .from('flights')
      .select('id', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      env: envCheck,
      testInsert: {
        success: true,
        booking_ref: testBookingRef,
        pnr_code: testPnr,
        flight_id: insertData?.id
      },
      database: {
        connected: !countError,
        flightCount: countData?.length || 0,
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
