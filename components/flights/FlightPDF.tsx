'use client';

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
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  docType: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  confirmationBox: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  flightCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  airlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flightNumber: {
    fontSize: 14,
    color: '#666',
  },
  airportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  airportCode: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  airportCity: {
    fontSize: 12,
    color: '#666',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeLabel: {
    fontSize: 10,
    color: '#666',
  },
  timeValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  passengerInfo: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  passengerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  passengerLabel: {
    width: 100,
    fontSize: 10,
    color: '#666',
  },
  passengerValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 8,
  },
  disclaimerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#d97706',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

interface FlightData {
  id: string;
  booking_ref: string;
  passenger_name: string;
  passenger_email: string;
  airline: string;
  flight_number: string;
  origin: string;
  origin_airport: string;
  destination: string;
  destination_airport: string;
  departure_date: string;
  departure_time: string;
  return_date: string | null;
  is_round_trip: boolean;
  created_at: string;
}

export function FlightPDF({ flight }: { flight: FlightData }) {
  const departureDate = new Date(flight.departure_date);
  const formattedDate = departureDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✈️ Moonr Flights</Text>
          <View>
            <Text style={styles.docType}>FLIGHT ITINERARY</Text>
            <Text style={styles.docType}>For Documentation Purposes Only</Text>
          </View>
        </View>

        {/* Confirmation Box */}
        <View style={styles.confirmationBox}>
          <Text>Booking Reference: {flight.booking_ref}</Text>
          <Text>Issue Date: {new Date().toLocaleDateString()}</Text>
          <Text>Status: Document Only - Not Boarding Pass</Text>
        </View>

        {/* Flight Card */}
        <View style={styles.flightCard}>
          <View style={styles.airlineRow}>
            <Text style={styles.airlineName}>{flight.airline}</Text>
            <Text style={styles.flightNumber}>{flight.flight_number}</Text>
          </View>

          <View style={styles.airportRow}>
            <View>
              <Text style={styles.airportCode}>{flight.origin_airport}</Text>
              <Text style={styles.airportCity}>{flight.origin}</Text>
            </View>
            <Text style={{ fontSize: 20 }}>✈️</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.airportCode}>{flight.destination_airport}</Text>
              <Text style={styles.airportCity}>{flight.destination}</Text>
            </View>
          </View>

          <View style={styles.timeRow}>
            <View>
              <Text style={styles.timeLabel}>Departure</Text>
              <Text style={styles.timeValue}>{flight.departure_time || '12:00'}</Text>
              <Text style={styles.timeLabel}>{formattedDate}</Text>
            </View>
            <View>
              <Text style={styles.timeLabel}>Class</Text>
              <Text style={styles.timeValue}>Economy</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.timeLabel}>Gate</Text>
              <Text style={styles.timeValue}>A12</Text>
            </View>
          </View>
        </View>

        {/* Return Flight if Round Trip */}
        {flight.is_round_trip && flight.return_date && (
          <View style={styles.flightCard}>
            <View style={styles.airlineRow}>
              <Text style={styles.airlineName}>{flight.airline}</Text>
              <Text style={styles.flightNumber}>{flight.flight_number}</Text>
            </View>

            <View style={styles.airportRow}>
              <View>
                <Text style={styles.airportCode}>{flight.destination_airport}</Text>
                <Text style={styles.airportCity}>{flight.destination}</Text>
              </View>
              <Text style={{ fontSize: 20 }}>✈️</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.airportCode}>{flight.origin_airport}</Text>
                <Text style={styles.airportCity}>{flight.origin}</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <View>
                <Text style={styles.timeLabel}>Return Departure</Text>
                <Text style={styles.timeValue}>{flight.departure_time || '12:00'}</Text>
                <Text style={styles.timeLabel}>
                  {new Date(flight.return_date).toLocaleDateString()}
                </Text>
              </View>
              <View>
                <Text style={styles.timeLabel}>Class</Text>
                <Text style={styles.timeValue}>Economy</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.timeLabel}>Gate</Text>
                <Text style={styles.timeValue}>B24</Text>
              </View>
            </View>
          </View>
        )}

        {/* Passenger Info */}
        <View style={styles.passengerInfo}>
          <View style={styles.passengerRow}>
            <Text style={styles.passengerLabel}>Passenger Name:</Text>
            <Text style={styles.passengerValue}>{flight.passenger_name}</Text>
          </View>
          <View style={styles.passengerRow}>
            <Text style={styles.passengerLabel}>Email:</Text>
            <Text style={styles.passengerValue}>{flight.passenger_email}</Text>
          </View>
          <View style={styles.passengerRow}>
            <Text style={styles.passengerLabel}>Ticket Type:</Text>
            <Text style={styles.passengerValue}>
              {flight.is_round_trip ? 'Round Trip' : 'One Way'}
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚠️ IMPORTANT - NOT A REAL AIRLINE TICKET</Text>
          <Text style={styles.disclaimerText}>
            • This document is for DOCUMENTATION PURPOSES ONLY (visa applications, travel planning)
          </Text>
          <Text style={styles.disclaimerText}>
            • This is NOT a real airline ticket. There is NO PNR in any airline reservation system.
          </Text>
          <Text style={styles.disclaimerText}>
            • You CANNOT board a flight using this document. It is NOT valid for travel.
          </Text>
          <Text style={styles.disclaimerText}>
            • Using this document for fraud or deception is illegal and punishable by law.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Moonr Flights • For legitimate visa and travel documentation purposes only</Text>
          <Text>This document has no cash value • Not valid for boarding</Text>
        </View>
      </Page>
    </Document>
  );
}
