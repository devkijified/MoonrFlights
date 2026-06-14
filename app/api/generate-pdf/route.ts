import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { FlightPDF } from '@/components/flights/FlightPDF';

export async function POST(request: NextRequest) {
  try {
    const { flightId } = await request.json();
    
    const supabase = await createClient();
    
    // Get flight data
    const { data: flight, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flightId)
      .single();
    
    if (error || !flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }
    
    // Generate PDF
    const pdfBuffer = await renderToBuffer(<FlightPDF flight={flight} />);
    
    // Upload to Supabase Storage (optional)
    const fileName = `itinerary-${flight.booking_ref}.pdf`;
    
    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
