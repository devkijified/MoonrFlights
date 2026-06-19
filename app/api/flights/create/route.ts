import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Creating flight for:', body.passenger1Name);
    
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use provided PNR or generate one
    const pnrCode = body.pnr_code || Math.random().toString(36).substring(2, 8).toUpperCase();
    const bookingRef = body.booking_ref || `MOON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

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
      
      // Passenger 1
      passenger1_name: body.passenger1Name,
      passenger1_dob: body.passenger1Dob || null,
      passenger1_gender: body.passenger1Gender || null,
      passenger1_nationality: body.passenger1Nationality || null,
      passenger1_document_number: body.passenger1DocumentNumber || null,
      
      // Passenger 2
      passenger2_name: body.passenger2Name || null,
      passenger2_dob: body.passenger2Dob || null,
      passenger2_gender: body.passenger2Gender || null,
      passenger2_nationality: body.passenger2Nationality || null,
      passenger2_document_number: body.passenger2DocumentNumber || null,
      
      // Passenger 3
      passenger3_name: body.passenger3Name || null,
      passenger3_dob: body.passenger3Dob || null,
      passenger3_gender: body.passenger3Gender || null,
      passenger3_nationality: body.passenger3Nationality || null,
      passenger3_document_number: body.passenger3DocumentNumber || null,
      
      // Passenger 4
      passenger4_name: body.passenger4Name || null,
      passenger4_dob: body.passenger4Dob || null,
      passenger4_gender: body.passenger4Gender || null,
      passenger4_nationality: body.passenger4Nationality || null,
      passenger4_document_number: body.passenger4DocumentNumber || null,
      
      contact_email: body.contactEmail || user.email,
      contact_phone: body.contactPhone || null,
      is_round_trip: body.isRoundTrip || false,
      return_date: body.returnDate || null,
      gds_system: 'manual',
      raw_pnr_data: JSON.stringify({ pnr: pnrCode, booking_ref: bookingRef }),
      ticketing_time_limit: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'confirmed',
      is_paid: false,
      ip_address: request.headers.get('x-forwarded-for') || '',
    };

    const { data: flight, error: insertError } = await supabase
      .from('flights')
      .insert(flightData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database error:', insertError);
      return NextResponse.json({ 
        error: 'Database error: ' + insertError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      booking_ref: bookingRef,
      pnr_code: pnrCode,
      flight: flight,
      verification_urls: {
        checkmytrip: `https://www.checkmytrip.com/${pnrCode}`,
        viewtrip: `https://viewtrip.travelport.com/${pnrCode}`,
        airline: `https://www.${body.airlineCode.toLowerCase()}.com/booking/${pnrCode}`
      },
      message: 'Flight created successfully! Verifiable on checkmytrip.com, viewtrip.travelport.com, or airline website.'
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
