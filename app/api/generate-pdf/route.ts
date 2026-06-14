import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { FlightPDF } from '@/components/flights/FlightPDF';

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
    
    const pdfBuffer = await renderToBuffer(<FlightPDF flight={flight} />);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="itinerary-${flight.booking_ref}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
