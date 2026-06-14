import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Moonr Flights API is working!',
    timestamp: new Date().toISOString(),
    status: 'online'
  });
}
