import axios from 'axios';

interface AmadeusToken {
  access_token: string;
  expires_in: number;
}

let cachedToken: AmadeusToken | null = null;

export class AmadeusClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseUrl = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';
    this.clientId = process.env.AMADEUS_CLIENT_ID || '';
    this.clientSecret = process.env.AMADEUS_CLIENT_SECRET || '';
  }

  async getToken(): Promise<string> {
    if (cachedToken && cachedToken.expires_in > Date.now()) {
      return cachedToken.access_token;
    }

    const response = await axios.post(
      `${this.baseUrl}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    cachedToken = {
      access_token: response.data.access_token,
      expires_in: Date.now() + response.data.expires_in * 1000,
    };

    return cachedToken.access_token;
  }

  async searchFlights(origin: string, destination: string, date: string) {
    const token = await this.getToken();
    
    const response = await axios.get(
      `${this.baseUrl}/v2/shopping/flight-offers`,
      {
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: date,
          adults: 1,
          max: 10,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.data;
  }

  async createPNR(bookingData: any) {
    const token = await this.getToken();

    // Create a booking (PNR) in Amadeus
    const response = await axios.post(
      `${this.baseUrl}/v1/booking/flight-orders`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      pnrCode: response.data.data.id,
      bookingData: response.data.data,
    };
  }

  async getPNR(pnrCode: string) {
    const token = await this.getToken();

    const response = await axios.get(
      `${this.baseUrl}/v1/booking/flight-orders/${pnrCode}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.data;
  }

  async cancelPNR(pnrCode: string) {
    const token = await this.getToken();

    const response = await axios.delete(
      `${this.baseUrl}/v1/booking/flight-orders/${pnrCode}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }
}

// Sabre Client (Alternative GDS)
export class SabreClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.SABRE_API_URL || 'https://api.sabre.com';
    this.apiKey = process.env.SABRE_API_KEY || '';
  }

  async createPNR(bookingData: any) {
    // Sabre PNR creation implementation
    const response = await axios.post(
      `${this.baseUrl}/v1/booking/create-pnr`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      pnrCode: response.data.PNR,
      bookingData: response.data,
    };
  }
}

// Travelport Client (Galileo/Worldspan)
export class TravelportClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.TRAVELPORT_API_URL || 'https://api.travelport.com';
    this.apiKey = process.env.TRAVELPORT_API_KEY || '';
  }

  async createPNR(bookingData: any) {
    const response = await axios.post(
      `${this.baseUrl}/v1/booking/create-pnr`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      pnrCode: response.data.UniversalRecord,
      bookingData: response.data,
    };
  }
}
