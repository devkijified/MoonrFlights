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
    
    // Generate HTML content
    const html = generateHTML(flight);
    
    // Return HTML that will be printed as PDF
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}

function generateHTML(flight: any) {
  const departureDate = new Date(flight.departure_date);
  const formattedDate = departureDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Flight Itinerary - ${flight.booking_ref}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      background: #f0f2f5;
      padding: 40px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .content { padding: 30px; }
    .booking-info {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .booking-info p { margin: 5px 0; font-size: 14px; }
    .flight-card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 25px;
    }
    .airline-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .airline-name { font-size: 18px; font-weight: bold; color: #1f2937; }
    .flight-number { font-size: 16px; color: #6b7280; }
    .airport-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .airport-code { font-size: 32px; font-weight: bold; color: #1f2937; }
    .airport-city { font-size: 12px; color: #6b7280; }
    .time-row {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }
    .time-label { font-size: 11px; color: #6b7280; margin-bottom: 5px; }
    .time-value { font-size: 14px; font-weight: bold; color: #1f2937; }
    .passenger-info {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .passenger-row { display: flex; margin-bottom: 10px; }
    .passenger-label { width: 130px; font-size: 12px; color: #6b7280; }
    .passenger-value { font-size: 12px; font-weight: bold; color: #1f2937; }
    .disclaimer {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .disclaimer-title { font-weight: bold; color: #d97706; margin-bottom: 10px; font-size: 12px; }
    .disclaimer-text { font-size: 10px; color: #6b7280; margin-bottom: 5px; }
    .footer {
      background: #f9fafb;
      padding: 15px;
      text-align: center;
      font-size: 10px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }
    .plane-icon { font-size: 24px; }
    @media print {
      body { background: white; padding: 0; }
      .no-print { display: none; }
    }
    .print-button {
      display: block;
      width: 200px;
      margin: 20px auto;
      padding: 12px 24px;
      background: #2563eb;
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      font-size: 14px;
      font-weight: bold;
    }
    .print-button:hover { background: #1e40af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ Moonr Flights</h1>
      <p>Flight Itinerary - Documentation Purposes Only</p>
    </div>
    
    <div class="content">
      <div class="booking-info">
        <p><strong>Booking Reference:</strong> ${flight.booking_ref}</p>
        <p><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Status:</strong> Document Only - Not Boarding Pass</p>
      </div>
      
      <div class="flight-card">
        <div class="airline-row">
          <span class="airline-name">${flight.airline}</span>
          <span class="flight-number">${flight.flight_number}</span>
        </div>
        
        <div class="airport-row">
          <div>
            <div class="airport-code">${flight.origin_airport}</div>
            <div class="airport-city">${flight.origin}</div>
          </div>
          <div class="plane-icon">✈️</div>
          <div style="text-align: right;">
            <div class="airport-code">${flight.destination_airport}</div>
            <div class="airport-city">${flight.destination}</div>
          </div>
        </div>
        
        <div class="time-row">
          <div>
            <div class="time-label">Departure</div>
            <div class="time-value">${flight.departure_time || '12:00'}</div>
            <div class="time-label">${formattedDate}</div>
          </div>
          <div>
            <div class="time-label">Class</div>
            <div class="time-value">Economy</div>
          </div>
          <div style="text-align: right;">
            <div class="time-label">Gate</div>
            <div class="time-value">A12</div>
          </div>
        </div>
      </div>
      
      ${flight.is_round_trip && flight.return_date ? `
      <div class="flight-card">
        <div class="airline-row">
          <span class="airline-name">${flight.airline}</span>
          <span class="flight-number">${flight.flight_number}</span>
        </div>
        
        <div class="airport-row">
          <div>
            <div class="airport-code">${flight.destination_airport}</div>
            <div class="airport-city">${flight.destination}</div>
          </div>
          <div class="plane-icon">✈️</div>
          <div style="text-align: right;">
            <div class="airport-code">${flight.origin_airport}</div>
            <div class="airport-city">${flight.origin}</div>
          </div>
        </div>
        
        <div class="time-row">
          <div>
            <div class="time-label">Return Departure</div>
            <div class="time-value">${flight.departure_time || '12:00'}</div>
            <div class="time-label">${new Date(flight.return_date).toLocaleDateString()}</div>
          </div>
          <div>
            <div class="time-label">Class</div>
            <div class="time-value">Economy</div>
          </div>
          <div style="text-align: right;">
            <div class="time-label">Gate</div>
            <div class="time-value">B24</div>
          </div>
        </div>
      </div>
      ` : ''}
      
      <div class="passenger-info">
        <div class="passenger-row">
          <div class="passenger-label">Passenger Name:</div>
          <div class="passenger-value">${flight.passenger_name}</div>
        </div>
        <div class="passenger-row">
          <div class="passenger-label">Email:</div>
          <div class="passenger-value">${flight.passenger_email || 'Not provided'}</div>
        </div>
        <div class="passenger-row">
          <div class="passenger-label">Ticket Type:</div>
          <div class="passenger-value">${flight.is_round_trip ? 'Round Trip' : 'One Way'}</div>
        </div>
      </div>
      
      <div class="disclaimer">
        <div class="disclaimer-title">⚠️ IMPORTANT - NOT A REAL AIRLINE TICKET</div>
        <div class="disclaimer-text">• This document is for DOCUMENTATION PURPOSES ONLY (visa applications, travel planning)</div>
        <div class="disclaimer-text">• This is NOT a real airline ticket. There is NO PNR in any airline reservation system.</div>
        <div class="disclaimer-text">• You CANNOT board a flight using this document. It is NOT valid for travel.</div>
        <div class="disclaimer-text">• Using this document for fraud or deception is illegal and punishable by law.</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Generated by Moonr Flights • For legitimate visa and travel documentation purposes only</p>
      <p>This document has no cash value • Not valid for boarding</p>
    </div>
  </div>
  
  <button class="print-button no-print" onclick="window.print();">🖨️ Print / Save as PDF</button>
  
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;
}
