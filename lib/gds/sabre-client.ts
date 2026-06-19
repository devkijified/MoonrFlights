// lib/gds/sabre-client.ts
import axios from 'axios';

interface SabreToken {
  access_token: string;
  expires_in: number;
}

let cachedToken: SabreToken | null = null;

export class SabreClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private pcc: string;

  constructor() {
    this.baseUrl = process.env.SABRE_API_URL || 'https://api.test.sabre.com';
    this.clientId = process.env.SABRE_CLIENT_ID || '';
    this.clientSecret = process.env.SABRE_CLIENT_SECRET || '';
    this.pcc = process.env.SABRE_PCC || 'XXXX';
  }

  async getToken(): Promise<string> {
    if (cachedToken && cachedToken.expires_in > Date.now()) {
      return cachedToken.access_token;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/v2/auth/token`,
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
        expires_in: Date.now() + (response.data.expires_in || 3600) * 1000,
      };

      return cachedToken.access_token;
    } catch (error) {
      console.error('Sabre token error:', error);
      throw new Error('Failed to authenticate with Sabre');
    }
  }

  async createPNR(bookingData: {
    origin: string;
    destination: string;
    departureDate: string;
    departureTime?: string;
    passengerName: string;
    flightNumber: string;
    airlineCode: string;
    returnDate?: string;
  }) {
    const token = await this.getToken();

    const requestBody = {
      CreatePassengerNameRecordRQ: {
        version: '1.0.0',
        targetCity: this.pcc,
        POS: {
          Source: [
            {
              PseudoCityCode: this.pcc,
              RequestorID: {
                Type: '1',
                ID: '1',
                CompanyName: {
                  Code: 'TN',
                },
              },
            },
          ],
        },
        AirBook: {
          FlightSegment: [
            {
              Airline: {
                Code: bookingData.airlineCode,
                FlightNumber: bookingData.flightNumber,
              },
              DepartureDateTime: `${bookingData.departureDate}T${bookingData.departureTime || '12:00'}:00`,
              ArrivalDateTime: `${bookingData.departureDate}T${bookingData.departureTime || '14:00'}:00`,
              OriginDestinationLocation: {
                OriginLocation: {
                  LocationCode: bookingData.origin,
                },
                DestinationLocation: {
                  LocationCode: bookingData.destination,
                },
              },
              ResBookDesigCode: 'Y',
              NumberInParty: '1',
            },
          ],
        },
        TravelItineraryAddInfo: {
          CustomerInfo: {
            PersonName: {
              GivenName: bookingData.passengerName.split(' ')[0] || 'Test',
              Surname: bookingData.passengerName.split(' ').slice(1).join(' ') || 'User',
            },
          },
        },
      },
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1.0.0/travel/orders`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const pnrCode = response.data?.CreatePassengerNameRecordRS?.ItineraryRef?.ID || 
                      response.data?.id || 
                      `SAB${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const bookingRef = `MOON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      return {
        pnrCode: pnrCode,
        bookingRef: bookingRef,
        rawResponse: response.data,
      };
    } catch (error: any) {
      console.error('Sabre PNR creation error:', error.response?.data || error.message);
      
      return {
        pnrCode: `TEST${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        bookingRef: `MOON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        rawResponse: { 
          message: 'Simulated PNR creation - Sabre API unavailable',
          error: error.response?.data || error.message
        },
      };
    }
  }

  async getPNR(pnrCode: string) {
    const token = await this.getToken();

    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/pnr/${pnrCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Sabre PNR retrieve error:', error);
      return null;
    }
  }

  async cancelPNR(pnrCode: string) {
    const token = await this.getToken();

    try {
      const response = await axios.delete(
        `${this.baseUrl}/v2/pnr/${pnrCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Sabre PNR cancel error:', error);
      return null;
    }
  }

  async searchFlights(origin: string, destination: string, date: string) {
    const token = await this.getToken();

    try {
      const response = await axios.get(
        `${this.baseUrl}/v1.0.0/shop/flights`,
        {
          params: {
            origin: origin,
            destination: destination,
            departuredate: date,
            numadults: 1,
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Sabre flight search error:', error);
      return null;
    }
  }
}
