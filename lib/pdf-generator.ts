import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

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
    borderBottomColor: '#1a73e8',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  docType: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'right',
  },
  airlineBanner: {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
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
    color: '#1a73e8',
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
    fontSize: 10,
    color: '#5f6368',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#202124',
  },
  passengerSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  passengerName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  passengerLabel: {
    fontSize: 10,
    color: '#5f6368',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
    letterSpacing: 2,
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
    fontSize: 9,
    color: '#5f6368',
    marginBottom: 4,
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
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: '#2e7d32',
  },
  // Barcode placeholder
  barcode: {
    width: 200,
    height: 60,
    backgroundColor: '#f5f5f5',
    marginVertical: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeBars: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  barcodeBar: {
    width: 2,
    backgroundColor: '#000',
    marginHorizontal: 1,
  },
});

interface FlightData {
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
  passenger2_name: string;
  passenger2_dob: string;
  passenger3_name: string;
  passenger3_dob: string;
  passenger4_name: string;
  passenger4_dob: string;
  contact_email: string;
  contact_phone: string;
  ticketing_time_limit: string;
  expires_at: string;
}

export async function generateFlightPDF(flight: FlightData) {
  // Get all passengers
  const passengers = [
    { name: flight.passenger1_name, dob: flight.passenger1_dob },
    { name: flight.passenger2_name, dob: flight.passenger2_dob },
    { name: flight.passenger3_name, dob: flight.passenger3_dob },
    { name: flight.passenger4_name, dob: flight.passenger4_dob },
  ].filter(p => p.name);

  const pdfBuffer = await renderToBuffer(
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✈️ Moonr Flights</Text>
          <View>
            <Text style={styles.docType}>E-TICKET / FLIGHT RESERVATION</Text>
            <Text style={styles.docType}>For Visa & Documentation Purposes</Text>
          </View>
        </View>

        {/* PNR Box */}
        <View style={styles.pnrBox}>
          <Text style={styles.pnrLabel}>BOOKING REFERENCE / PNR</Text>
          <Text style={styles.pnrCode}>{flight.pnr_code}</Text>
          <Text style={[styles.verifiedText, { marginTop: 8 }]}>
            ✅ Verifiable on airline website or checkmytrip.com
          </Text>
        </View>

        {/* Airline Banner */}
        <View style={styles.airlineBanner}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.airlineName}>{flight.airline}</Text>
            <Text style={styles.flightNumber}>{flight.flight_number}</Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <View>
            <Text style={styles.airportCode}>{flight.origin_airport}</Text>
            <Text style={styles.airportCity}>{flight.origin}</Text>
          </View>
          <Text style={{ fontSize: 24, color: '#1a73e8' }}>✈️</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.airportCode}>{flight.destination_airport}</Text>
            <Text style={styles.airportCity}>{flight.destination}</Text>
          </View>
        </View>

        {/* Flight Info */}
        <View style={styles.flightInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(flight.flight_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{flight.flight_time}</Text>
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
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
            PASSENGERS ({passengers.length})
          </Text>
          {passengers.map((passenger, index) => (
            <View key={index} style={styles.passengerRow}>
              <Text style={styles.passengerName}>{passenger.name}</Text>
              <Text style={styles.passengerLabel}>
                DOB: {passenger.dob ? new Date(passenger.dob).toLocaleDateString() : 'Not provided'}
              </Text>
            </View>
          ))}
        </View>

        {/* Ticketing Info */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={styles.infoLabel}>Ticketing Time Limit</Text>
            <Text style={styles.infoValue}>
              {new Date(flight.ticketing_time_limit).toLocaleString()}
            </Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Reservation Valid Until</Text>
            <Text style={styles.infoValue}>
              {new Date(flight.expires_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Contact */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={{ fontSize: 12 }}>{flight.contact_email}</Text>
          {flight.contact_phone && <Text style={{ fontSize: 12 }}>{flight.contact_phone}</Text>}
        </View>

        {/* Barcode */}
        <View style={styles.barcode}>
          <View style={styles.barcodeBars}>
            {Array.from({ length: 50 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.barcodeBar,
                  {
                    height: 20 + Math.random() * 30,
                    opacity: 0.3 + Math.random() * 0.7,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Verification */}
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>
            ✅ Verify this booking at: https://moonr-flights.vercel.app/verify/{flight.booking_ref}
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { fontWeight: 'bold', color: '#e65100' }]}>
            ⚠️ IMPORTANT - THIS IS A TEMPORARY RESERVATION
          </Text>
          <Text style={styles.disclaimerText}>
            • This is a confirmed flight reservation (PNR) created for visa applications and documentation purposes.
          </Text>
          <Text style={styles.disclaimerText}>
            • This is NOT a paid ticket. You CANNOT board a flight with this document.
          </Text>
          <Text style={styles.disclaimerText}>
            • The reservation will automatically expire after 14 days if not ticketed.
          </Text>
          <Text style={styles.disclaimerText}>
            • Verifiable online on airline websites or GDS systems like checkmytrip.com.
          </Text>
          <Text style={[styles.disclaimerText, { fontWeight: 'bold', color: '#e65100', marginTop: 4 }]}>
            • For legitimate visa applications and travel planning ONLY. Not for fraud.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Moonr Flights • GDS Verified • PNR: {flight.pnr_code}</Text>
          <Text>This document is a legitimate flight reservation for documentation purposes.</Text>
        </View>
      </Page>
    </Document>
  );

  return pdfBuffer;
}
