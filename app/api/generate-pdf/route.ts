import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { flightId } = await request.json();
    
    const supabase = await createClient();
    
    const { data: flight, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flightId)
      .single();
    
    if (error || !flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }
    
    // Return flight data for now (PDF generation coming soon)
    return NextResponse.json({
      success: true,
      message: 'PDF generation endpoint working',
      flight: {
        id: flight.id,
        booking_ref: flight.booking_ref,
        passenger_name: flight.passenger_name,
        flight_number: flight.flight_number,
        origin: flight.origin,
        destination: flight.destination,
        departure_date: flight.departure_date
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Generate PDF API endpoint. Use POST request with { flightId: "id" }',
    status: 'ready'
  });
}
