import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { flightId } = await request.json();
    
    if (!flightId) {
      return NextResponse.json({ error: 'Flight ID is required' }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    const { data: flight, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flightId)
      .single();
    
    if (error || !flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }
    
    // Dynamic import to avoid build issues
    const { generateFlightPDF } = await import('@/lib/pdf-generator');
    const pdfBuffer = await generateFlightPDF(flight);
    
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
