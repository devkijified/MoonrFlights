import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.cdnfonts.com/css/helvetica-2', fontWeight: 'normal' },
    { src: 'https://fonts.cdnfonts.com/css/helvetica-2', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  docType: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'right',
  },
  pnrBox: {
    backgroundColor: '#e8f0fe',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  pnrLabel: {
    fontSize: 10,
    color: '#5f6368',
    marginBottom: 4,
  },
  pnrCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: 3,
  },
  pnrVerify: {
    fontSize: 9,
    color: '#2e7d32',
    marginTop: 4,
  },
  airlineBanner: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airlineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  flightNumber: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  airportCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  airportCity: {
    fontSize: 14,
    color: '#5f6368',
  },
  flightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    color: '#5f6368',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#202124',
  },
  passengerSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  passengerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#202124',
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  passengerName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#202124',
  },
  passengerDetail: {
    fontSize: 10,
    color: '#5f6368',
  },
  passengerDetailLabel: {
    fontSize: 8,
    color: '#9aa0a6',
    marginRight: 4,
  },
  contactSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  contactLabel: {
    fontSize: 9,
    color: '#5f6368',
    width: 80,
  },
  contactValue: {
    fontSize: 9,
    color: '#202124',
  },
  disclaimer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  disclaimerText: {
    fontSize: 8,
    color: '#5f6368',
    marginBottom: 3,
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#9e9e9e',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  verifiedBadge: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 9,
    color: '#2e7d32',
  },
  barcode: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 8,
    color: '#5f6368',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
});

interface Passenger {
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  documentNumber: string;
}

interface FlightData {
  id: string;
  pnr_code: string;
  booking_ref: string;
  airline: string;
  airline_code: string;
  flight_number: string;
  flight_date: string;
  flight_time: string;
  origin: string;
  origin_airport: string;
  destination: string;
  destination_airport: string;
  passenger1_name: string;
  passenger1_dob: string;
  passenger1_gender: string;
  passenger1_nationality: string;
  passenger1_document_number: string;
  passenger2_name: string;
  passenger2_dob: string;
  passenger2_gender: string;
  passenger2_nationality: string;
  passenger2_document_number: string;
  passenger3_name: string;
  passenger3_dob: string;
  passenger3_gender: string;
  passenger3_nationality: string;
  passenger3_document_number: string;
  passenger4_name: string;
  passenger4_dob: string;
  passenger4_gender: string;
  passenger4_nationality: string;
  passenger4_document_number: string;
  contact_email: string;
  contact_phone: string;
  is_round_trip: boolean;
  return_date: string;
  expires_at: string;
  created_at: string;
}

function getPassengers(flight: FlightData): Passenger[] {
  const passengers: Passenger[] = [];
  
  if (flight.passenger1_name) {
    passengers.push({
      name: flight.passenger1_name,
      dob: flight.passenger1_dob || 'Not provided',
      gender: flight.passenger1_gender || 'Not provided',
      nationality: flight.passenger1_nationality || 'Not provided',
      documentNumber: flight.passenger1_document_number || 'Not provided',
    });
  }
  if (flight.passenger2_name) {
    passengers.push({
      name: flight.passenger2_name,
      dob: flight.passenger2_dob || 'Not provided',
      gender: flight.passenger2_gender || 'Not provided',
      nationality: flight.passenger2_nationality || 'Not provided',
      documentNumber: flight.passenger2_document_number || 'Not provided',
    });
  }
  if (flight.passenger3_name) {
    passengers.push({
      name: flight.passenger3_name,
      dob: flight.passenger3_dob || 'Not provided',
      gender: flight.passenger3_gender || 'Not provided',
      nationality: flight.passenger3_nationality || 'Not provided',
      documentNumber: flight.passenger3_document_number || 'Not provided',
    });
  }
  if (flight.passenger4_name) {
    passengers.push({
      name: flight.passenger4_name,
      dob: flight.passenger4_dob || 'Not provided',
      gender: flight.passenger4_gender || 'Not provided',
      nationality: flight.passenger4_nationality || 'Not provided',
      documentNumber: flight.passenger4_document_number || 'Not provided',
    });
  }
  
  return passengers;
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Date not set';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

function formatDateTime(dateString: string): string {
  if (!dateString) return 'Date not set';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

export async function generateFlightPDF(flight: FlightData) {
  const passengers = getPassengers(flight);
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${flight.booking_ref}`;

  const pdfBuffer = await renderToBuffer(
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✈️ Moonr Flights</Text>
          <View>
            <Text style={styles.docType}>FLIGHT ITINERARY</Text>
            <Text style={styles.docType}>Documentation Purposes Only</Text>
          </View>
        </View>

        {/* PNR Box */}
        <View style={styles.pnrBox}>
          <Text style={styles.pnrLabel}>BOOKING REFERENCE / PNR</Text>
          <Text style={styles.pnrCode}>{flight.pnr_code}</Text>
          <Text style={styles.pnrVerify}>✅ Verifiable on airline websites and GDS systems</Text>
        </View>

        {/* Airline Banner */}
        <View style={styles.airlineBanner}>
          <Text style={styles.airlineName}>{flight.airline}</Text>
          <Text style={styles.flightNumber}>{flight.flight_number}</Text>
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <View>
            <Text style={styles.airportCode}>{flight.origin_airport}</Text>
            <Text style={styles.airportCity}>{flight.origin}</Text>
          </View>
          <Text style={{ fontSize: 24, color: '#2563eb' }}>✈️</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.airportCode}>{flight.destination_airport}</Text>
            <Text style={styles.airportCity}>{flight.destination}</Text>
          </View>
        </View>

        {/* Flight Info */}
        <View style={styles.flightInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDate(flight.flight_date)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{flight.flight_time || '12:00'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Class</Text>
            <Text style={styles.infoValue}>Economy</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: '#2e7d32' }]}>CONFIRMED</Text>
          </View>
        </View>

        {/* Passengers */}
        <View style={styles.passengerSection}>
          <Text style={styles.passengerTitle}>PASSENGER DETAILS ({passengers.length})</Text>
          {passengers.map((p, index) => (
            <View key={index} style={styles.passengerRow}>
              <Text style={styles.passengerName}>{p.name}</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Text style={styles.passengerDetail}>
                  <Text style={styles.passengerDetailLabel}>DOB:</Text> {p.dob}
                </Text>
                <Text style={styles.passengerDetail}>
                  <Text style={styles.passengerDetailLabel}>Gender:</Text> {p.gender}
                </Text>
                <Text style={styles.passengerDetail}>
                  <Text style={styles.passengerDetailLabel}>Nationality:</Text> {p.nationality}
                </Text>
                <Text style={styles.passengerDetail}>
                  <Text style={styles.passengerDetailLabel}>Doc:</Text> {p.documentNumber}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Return Flight if Round Trip */}
        {flight.is_round_trip && flight.return_date && (
          <View style={{ marginBottom: 20, padding: 15, backgroundColor: '#f0f4ff', borderRadius: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 }}>
              🔄 RETURN FLIGHT
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 9, color: '#5f6368' }}>Return Date</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{formatDate(flight.return_date)}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 9, color: '#5f6368' }}>Route</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                  {flight.destination_airport} → {flight.origin_airport}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>CONTACT INFORMATION</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactValue}>{flight.contact_email}</Text>
          </View>
          {flight.contact_phone && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactValue}>{flight.contact_phone}</Text>
            </View>
          )}
        </View>

        {/* Barcode/Verification */}
        <View style={styles.barcode}>
          <Text style={styles.barcodeText}>||| {flight.pnr_code} ||| {flight.booking_ref} |||</Text>
        </View>

        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>
            🔍 Verify this booking at: {verificationUrl}
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚠️ IMPORTANT - DOCUMENTATION PURPOSES ONLY</Text>
          <Text style={styles.disclaimerText}>
            • This is a confirmed flight reservation (PNR) for visa applications and documentation purposes.
          </Text>
          <Text style={styles.disclaimerText}>
            • This is NOT a paid ticket. You CANNOT board a flight with this document.
          </Text>
          <Text style={styles.disclaimerText}>
            • The reservation is valid until {formatDateTime(flight.expires_at)}.
          </Text>
          <Text style={styles.disclaimerText}>
            • Verifiable online on airline websites or GDS systems like checkmytrip.com.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Moonr Flights • PNR: {flight.pnr_code} • Booking: {flight.booking_ref}</Text>
          <Text>Created: {formatDateTime(flight.created_at)} • Documentation Only</Text>
        </View>
      </Page>
    </Document>
  );

  return pdfBuffer;
}
