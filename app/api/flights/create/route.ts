import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AmadeusClient } from '@/lib/gds/amadeus-client';
import { generatePNR } from '@/lib/utils/pnr-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate unique PNR (6 characters)
    const pnrCode = generatePNR();
    const bookingRef = `MOON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Create booking in GDS
    const amadeusClient = new AmadeusClient();
    const gdsBooking = await amadeusClient.createPNR({
      flightNumber: body.flightNumber,
      origin: body.originAirport,
      destination: body.destinationAirport,
      departureDate: body.departureDate,
      departureTime: body.departureTime,
      passengers: [
        { name: body.passenger1Name, dob: body.passenger1Dob },
        { name: body.passenger2Name, dob: body.passenger2Dob },
        { name: body.passenger3Name, dob: body.passenger3Dob },
        { name: body.passenger4Name, dob: body.passenger4Dob },
      ].filter(p => p.name),
      contact: {
        email: body.contactEmail,
        phone: body.contactPhone,
      },
    });

    // Save to database
    const { data: flight, error } = await supabase
      .from('flights')
      .insert({
        user_id: user.id,
        pnr_code: pnrCode,
        booking_ref: bookingRef,
        airline: body.airline,
        airline_code: body.airlineCode,
        flight_number: body.flightNumber,
        flight_date: body.departureDate,
        flight_time: body.departureTime,
        origin: body.origin,
        origin_airport: body.originAirport,
        destination: body.destination,
        destination_airport: body.destinationAirport,
        passenger1_name: body.passenger1Name,
        passenger1_dob: body.passenger1Dob,
        passenger2_name: body.passenger2Name || null,
        passenger2_dob: body.passenger2Dob || null,
        passenger3_name: body.passenger3Name || null,
        passenger3_dob: body.passenger3Dob || null,
        passenger4_name: body.passenger4Name || null,
        passenger4_dob: body.passenger4Dob || null,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhone || null,
        gds_system: 'amadeus',
        raw_pnr_data: JSON.stringify(gdsBooking),
        ticketing_time_limit: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        ip_address: request.headers.get('x-forwarded-for') || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    // Generate PDF
    const pdfBuffer = await generateFlightPDF(flight);

    // Send email
    await sendBookingConfirmation(flight, pdfBuffer);

    return NextResponse.json({
      success: true,
      booking_ref: bookingRef,
      pnr_code: pnrCode,
      booking: flight,
      message: 'Booking created successfully! Check your email for details.',
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
