import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PNRConverter } from '@/lib/gds/pnr-converter';

export async function POST(request: NextRequest) {
  try {
    const { rawPnrData, gdsSystem } = await request.json();
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Convert raw PNR to structured data
    const converter = new PNRConverter();
    const convertedData = await converter.convertRawPNR(rawPnrData, gdsSystem);

    // Save conversion
    await supabase
      .from('pnr_conversions')
      .insert({
        user_id: user.id,
        raw_pnr_data: rawPnrData,
        gds_system: gdsSystem,
        converted_pdf_url: null,
        email_sent: false,
      });

    // Generate PDF from converted data
    const pdfBuffer = await generatePNRPDF(convertedData);

    // Send email
    await sendPNRConversionEmail(user.email, convertedData, pdfBuffer);

    return NextResponse.json({
      success: true,
      converted: convertedData,
      message: 'PNR converted successfully! PDF sent to your email.',
    });

  } catch (error) {
    console.error('PNR conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert PNR' },
      { status: 500 }
    );
  }
}
