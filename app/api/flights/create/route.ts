// app/api/flights/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Creating flight for:', body.passenger1Name);
    
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in',
        details: authError?.message 
      }, { status: 401 });
    }

    // Generate references
    const bookingRef = `MOON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const pnrCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Prepare flight data
    const flightData = {
      user_id: user.id,
      pnr_code: pnrCode,
      booking_ref: bookingRef,
      airline: body.airline,
      airline_code: body.airlineCode || 'DL',
      flight_number: body.flightNumber,
      flight_date: body.departureDate,
      flight_time: body.departureTime || '12:00',
      origin: body.origin,
      origin_airport: body.originAirport.toUpperCase(),
      destination: body.destination,
      destination_airport: body.destinationAirport.toUpperCase(),
      passenger1_name: body.passenger1Name,
      passenger1_dob: body.passenger1Dob || null,
      passenger2_name: body.passenger2Name || null,
      passenger2_dob: body.passenger2Dob || null,
      passenger3_name: body.passenger3Name || null,
      passenger3_dob: body.passenger3Dob || null,
      passenger4_name: body.passenger4Name || null,
      passenger4_dob: body.passenger4Dob || null,
      contact_email: body.contactEmail || user.email,
      contact_phone: body.contactPhone || null,
      gds_system: 'manual',
      raw_pnr_data: JSON.stringify({ pnr: pnrCode, booking_ref: bookingRef }),
      ticketing_time_limit: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'confirmed',
      is_paid: false,
      ip_address: request.headers.get('x-forwarded-for') || '',
    };

    console.log('💾 Inserting flight:', flightData.booking_ref);

    // Insert into Supabase
    const { data: flight, error: insertError } = await supabase
      .from('flights')
      .insert(flightData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database error:', insertError);
      return NextResponse.json({ 
        error: 'Database error: ' + insertError.message,
        code: insertError.code,
        details: insertError.details
      }, { status: 500 });
    }

    console.log('✅ Flight created:', flight.id);

    return NextResponse.json({
      success: true,
      booking_ref: bookingRef,
      pnr_code: pnrCode,
      flight: flight,
      message: 'Flight created successfully!'
    });

  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json({ 
      error: 'Server error: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}

export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use POST to create a flight.',
    methods: ['POST']
  }, { status: 405 });
}
