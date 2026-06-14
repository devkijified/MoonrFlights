import { renderToBuffer } from '@react-pdf/renderer';

export async function generateFlightPDF(flight: any) {
  try {
    // Dynamically import the PDF component to avoid build issues
    const { FlightPDF } = await import('@/components/flights/FlightPDF');
    
    const pdfBuffer = await renderToBuffer(FlightPDF({ flight }));
    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
