import { AmadeusClient, SabreClient, TravelportClient } from './amadeus-client';

interface GDSResponse {
  pnrCode: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  passengers: Array<{ name: string; dob?: string }>;
  ticketingTimeLimit: string;
}

export class PNRConverter {
  async convertRawPNR(rawData: string, gdsSystem: string): Promise<GDSResponse> {
    let client;
    
    switch (gdsSystem.toLowerCase()) {
      case 'amadeus':
        client = new AmadeusClient();
        break;
      case 'sabre':
        client = new SabreClient();
        break;
      case 'galileo':
      case 'travelport':
        client = new TravelportClient();
        break;
      default:
        throw new Error('Unsupported GDS system');
    }

    // Parse the raw PNR data based on GDS format
    const parsedData = this.parseRawData(rawData, gdsSystem);
    
    // Get PNR details from GDS
    const pnrData = await client.getPNR(parsedData.pnrCode);
    
    return this.formatResponse(pnrData);
  }

  private parseRawData(rawData: string, gdsSystem: string): any {
    // GDS-specific parsing logic
    switch (gdsSystem.toLowerCase()) {
      case 'amadeus':
        return this.parseAmadeusRaw(rawData);
      case 'sabre':
        return this.parseSabreRaw(rawData);
      case 'galileo':
        return this.parseGalileoRaw(rawData);
      default:
        return null;
    }
  }

  private parseAmadeusRaw(rawData: string) {
    // Example: Extract PNR from Amadeus raw format
    const pnrMatch = rawData.match(/PNR:\s*([A-Z0-9]{6})/i);
    return { pnrCode: pnrMatch?.[1] || '' };
  }

  private parseSabreRaw(rawData: string) {
    const pnrMatch = rawData.match(/PNR:\s*([A-Z0-9]{6})/i);
    return { pnrCode: pnrMatch?.[1] || '' };
  }

  private parseGalileoRaw(rawData: string) {
    const pnrMatch = rawData.match(/PNR:\s*([A-Z0-9]{6})/i);
    return { pnrCode: pnrMatch?.[1] || '' };
  }

  private formatResponse(pnrData: any): GDSResponse {
    // Format the GDS response into a standardized structure
    return {
      pnrCode: pnrData.id || pnrData.PNR || pnrData.UniversalRecord || '',
      airline: pnrData.airline || '',
      flightNumber: pnrData.flightNumber || '',
      origin: pnrData.origin || '',
      destination: pnrData.destination || '',
      departureDate: pnrData.departureDate || '',
      departureTime: pnrData.departureTime || '',
      arrivalDate: pnrData.arrivalDate || '',
      arrivalTime: pnrData.arrivalTime || '',
      passengers: pnrData.passengers || [],
      ticketingTimeLimit: pnrData.ticketingTimeLimit || '',
    };
  }
}
