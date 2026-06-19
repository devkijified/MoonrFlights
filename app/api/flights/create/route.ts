import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SabreClient } from '@/lib/gds/sabre-client';
import { generatePNR, generateBookingRef } from '@/lib/utils/pnr-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sabre = new SabreClient();
    const pnrCode = generatePNR();
    const bookingRef = generateBookingRef();

    try {
      const sabreBooking = await sabre.createPNR({
        origin: body.originAirport,
        destination: body.destinationAirport,
        departureDate: body.departureDate,
        departureTime: body.departureTime || '12:00',
        passengerName: body.passenger1Name,
        flightNumber: body.flightNumber,
        airlineCode: body.airlineCode || 'DL',
      });

      const { data: flight, error } = await supabase
        .from('flights')
        .insert({
          user_id: user.id,
          pnr_code: sabreBooking.pnrCode || pnrCode,
          booking_ref: bookingRef,
          airline: body.airline,
          airline_code: body.airlineCode || 'DL',
          flight_number: body.flightNumber,
          flight_date: body.departureDate,
          flight_time: body.departureTime || '12:00',
          origin: body.origin,
          origin_airport: body.originAirport,
          destination: body.destination,
          destination_airport: body.destinationAirport,
          passenger1_name: body.passenger1Name,
          passenger1_dob: body.passenger1Dob || null,
          passenger2_name: body.passenger2Name || null,
          passenger2_dob: body.passenger2Dob || null,
          passenger3_name: body.passenger3Name || null,
          passenger3_dob: body.passenger3Dob || null,
          passenger4_name: body.passenger4Name || null,
          passenger4_dob: body.passenger4Dob || null,
          contact_email: body.contactEmail,
          contact_phone: body.contactPhone || null,
          gds_system: 'sabre',
          raw_pnr_data: JSON.stringify(sabreBooking.rawResponse),
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

      return NextResponse.json({
        success: true,
        booking_ref: bookingRef,
        pnr_code: sabreBooking.pnrCode || pnrCode,
        booking: flight,
        message: 'Booking created successfully!',
      });

    } catch (sabreError) {
      console.error('Sabre API Error:', sabreError);
      
      // Fallback: Create booking without Sabre
      const fallbackPNR = generatePNR();
      
      const { data: flight, error } = await supabase
        .from('flights')
        .insert({
          user_id: user.id,
          pnr_code: fallbackPNR,
          booking_ref: bookingRef,
          airline: body.airline,
          airline_code: body.airlineCode || 'DL',
          flight_number: body.flightNumber,
          flight_date: body.departureDate,
          flight_time: body.departureTime || '12:00',
          origin: body.origin,
          origin_airport: body.originAirport,
          destination: body.destination,
          destination_airport: body.destinationAirport,
          passenger1_name: body.passenger1Name,
          passenger1_dob: body.passenger1Dob || null,
          passenger2_name: body.passenger2Name || null,
          passenger2_dob: body.passenger2Dob || null,
          passenger3_name: body.passenger3Name || null,
          passenger3_dob: body.passenger3Dob || null,
          passenger4_name: body.passenger4Name || null,
          passenger4_dob: body.passenger4Dob || null,
          contact_email: body.contactEmail,
          contact_phone: body.contactPhone || null,
          gds_system: 'manual_fallback',
          raw_pnr_data: JSON.stringify({ error: 'Sabre unavailable' }),
          ticketing_time_limit: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          ip_address: request.headers.get('x-forwarded-for') || '',
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        booking_ref: bookingRef,
        pnr_code: fallbackPNR,
        booking: flight,
        warning: 'Sabre API unavailable - using fallback booking',
      });
    }

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
