import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateFlightPDF } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { flightId } = await request.json();
    
    if (!flightId) {
      return NextResponse.json({ error: 'Flight ID is required' }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // Get flight data
    const { data: flight, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flightId)
      .single();
    
    if (error || !flight) {
      console.error('Flight not found:', error);
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }
    
    // Generate PDF
    const pdfBuffer = await generateFlightPDF(flight);
    
    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="itinerary-${flight.booking_ref}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF. Please try again.' },
      { status: 500 }
    );
  }
}
