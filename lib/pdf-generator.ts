import { renderToBuffer } from '@react-pdf/renderer';
import { FlightPDF } from '@/components/flights/FlightPDF';

export async function generateFlightPDF(flight: any) {
  try {
    const pdfBuffer = await renderToBuffer(<FlightPDF flight={flight} />);
    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
}
