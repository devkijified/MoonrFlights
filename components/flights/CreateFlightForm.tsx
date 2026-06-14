'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Plane, Calendar, MapPin, User } from 'lucide-react';

const flightSchema = z.object({
  passengerName: z.string().min(2, 'Passenger name required'),
  passengerEmail: z.string().email('Valid email required').optional(),
  origin: z.string().min(2, 'Origin city required'),
  originAirport: z.string().length(3, '3-letter airport code'),
  destination: z.string().min(2, 'Destination city required'),
  destinationAirport: z.string().length(3, '3-letter airport code'),
  departureDate: z.string().min(1, 'Departure date required'),
  departureTime: z.string().optional(),
  returnDate: z.string().optional(),
  isRoundTrip: z.boolean().default(false),
  airline: z.string().min(2, 'Airline required'),
  flightNumber: z.string().min(3, 'Flight number required'),
  notes: z.string().optional(),
});

type FlightFormData = z.infer<typeof flightSchema>;

export function CreateFlightForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: { isRoundTrip: false }
  });
  
  const isRoundTrip = watch('isRoundTrip');

  const onSubmit = async (data: FlightFormData) => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Please sign in first');
      setLoading(false);
      return;
    }
    
    const bookingRef = `MOON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    const { error } = await supabase.from('flights').insert({
      user_id: user.id,
      passenger_name: data.passengerName,
      passenger_email: data.passengerEmail,
      origin: data.origin,
      origin_airport: data.originAirport.toUpperCase(),
      destination: data.destination,
      destination_airport: data.destinationAirport.toUpperCase(),
      departure_date: data.departureDate,
      departure_time: data.departureTime,
      return_date: data.returnDate,
      is_round_trip: data.isRoundTrip,
      airline: data.airline,
      flight_number: data.flightNumber,
      booking_ref: bookingRef,
      notes: data.notes,
    });
    
    if (error) {
      toast.error('Failed to create flight');
      console.error(error);
    } else {
      toast.success('Flight itinerary created!');
      reset();
      onSuccess?.();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} /> Passenger Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passenger Full Name *
            </label>
            <input
              {...register('passengerName')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="John Smith"
            />
            {errors.passengerName && <p className="text-red-500 text-xs mt-1">{errors.passengerName.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Email</label>
            <input
              {...register('passengerEmail')}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="passenger@example.com"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plane size={20} /> Flight Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Airline *</label>
            <input
              {...register('airline')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Delta Air Lines"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number *</label>
            <input
              {...register('flightNumber')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="DL1234"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} /> Route
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin City *</label>
            <input
              {...register('origin')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="New York"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin Airport Code *</label>
            <input
              {...register('originAirport')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 uppercase"
              placeholder="JFK"
              maxLength={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination City *</label>
            <input
              {...register('destination')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="London"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination Airport Code *</label>
            <input
              {...register('destinationAirport')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 uppercase"
              placeholder="LHR"
              maxLength={3}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={20} /> Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date *</label>
            <input
              {...register('departureDate')}
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
            <input
              {...register('departureTime')}
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input {...register('isRoundTrip')} type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700">Round Trip</span>
            </label>
          </div>
          
          {isRoundTrip && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <input
                {...register('returnDate')}
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Any additional information..."
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating...' : '✈️ Generate Flight Itinerary'}
      </button>
    </form>
  );
}
