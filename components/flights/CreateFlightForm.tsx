'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import { Plane, Calendar, MapPin, User, Mail, Phone, Plus, X } from 'lucide-react';

// Schema with dynamic passenger validation
const passengerSchema = z.object({
  name: z.string().min(2, 'Name required'),
  dob: z.string().optional(),
});

const flightSchema = z.object({
  // Dynamic passengers (up to 4)
  passengers: z.array(passengerSchema).min(1, 'At least one passenger required').max(4, 'Maximum 4 passengers'),
  
  // Contact
  contactEmail: z.string().email('Valid email required'),
  contactPhone: z.string().optional(),
  
  // Route
  origin: z.string().min(2, 'Origin city required'),
  originAirport: z.string().length(3, '3-letter airport code'),
  destination: z.string().min(2, 'Destination city required'),
  destinationAirport: z.string().length(3, '3-letter airport code'),
  
  // Flight
  airline: z.string().min(2, 'Airline required'),
  airlineCode: z.string().min(2, 'Airline code required'),
  flightNumber: z.string().min(3, 'Flight number required'),
  departureDate: z.string().min(1, 'Departure date required'),
  departureTime: z.string().optional(),
  returnDate: z.string().optional(),
  isRoundTrip: z.boolean().default(false),
});

type FlightFormData = z.infer<typeof flightSchema>;

export function CreateFlightForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit, watch, formState: { errors }, reset } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      passengers: [{ name: '', dob: '' }],
      isRoundTrip: false,
      airlineCode: 'DL',
      departureTime: '12:00'
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'passengers'
  });

  const isRoundTrip = watch('isRoundTrip');

  const addPassenger = () => {
    if (fields.length < 4) {
      append({ name: '', dob: '' });
    } else {
      toast.error('Maximum 4 passengers allowed');
    }
  };

  const onSubmit = async (data: FlightFormData) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in first');
        setLoading(false);
        return;
      }

      // Map passengers to the format expected by the API
      const passengerData: any = {};
      data.passengers.forEach((p, index) => {
        const num = index + 1;
        passengerData[`passenger${num}Name`] = p.name;
        passengerData[`passenger${num}Dob`] = p.dob || null;
      });

      const response = await fetch('/api/flights/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...passengerData,
          contactEmail: data.contactEmail || user.email,
          contactPhone: data.contactPhone || null,
          origin: data.origin,
          originAirport: data.originAirport,
          destination: data.destination,
          destinationAirport: data.destinationAirport,
          airline: data.airline,
          airlineCode: data.airlineCode,
          flightNumber: data.flightNumber,
          departureDate: data.departureDate,
          departureTime: data.departureTime || '12:00',
          returnDate: data.returnDate || null,
          isRoundTrip: data.isRoundTrip,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create flight');
      }

      toast.success(`Flight created! Booking: ${result.booking_ref}`);
      reset({
        passengers: [{ name: '', dob: '' }],
        isRoundTrip: false,
        airlineCode: 'DL',
        departureTime: '12:00'
      });
      onSuccess?.();

    } catch (error: any) {
      console.error('Error creating flight:', error);
      toast.error(error.message || 'Failed to create flight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Passengers Section */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User size={20} /> Passengers
          </h3>
          <span className="text-sm text-gray-500">{fields.length} of 4</span>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="relative bg-white p-4 rounded-lg mb-3 border border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Passenger {index + 1}</span>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name {index === 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  {...register(`passengers.${index}.name`)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="John Doe"
                />
                {errors.passengers?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.passengers[index]?.name?.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  {...register(`passengers.${index}.dob`)}
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        ))}
        
        {fields.length < 4 && (
          <button
            type="button"
            onClick={addPassenger}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus size={16} />
            Add Passenger
          </button>
        )}
      </div>
      
      {/* Flight Details */}
      <div className="bg-purple-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plane size={20} /> Flight Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Airline *</label>
            <input
              {...register('airline')}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Delta Air Lines"
            />
            {errors.airline && <p className="text-red-500 text-xs mt-1">{errors.airline.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Airline Code *</label>
            <input
              {...register('airlineCode')}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              placeholder="DL"
              maxLength={2}
            />
            {errors.airlineCode && <p className="text-red-500 text-xs mt-1">{errors.airlineCode.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Flight Number *</label>
            <input
              {...register('flightNumber')}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="1234"
            />
            {errors.flightNumber && <p className="text-red-500 text-xs mt-1">{errors.flightNumber.message}</p>}
          </div>
        </div>
      </div>
      
      {/* Route */}
      <div className="bg-green-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin size={20} /> Route
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Origin City *</label>
            <input
              {...register('origin')}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="New York"
            />
            {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origin Airport Code *</label>
            <input
              {...register('originAirport')}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              placeholder="JFK"
              maxLength={3}
            />
            {errors.originAirport && <p className="text-red-500 text-xs mt-1">{errors.originAirport.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination City *</label>
            <input
              {...register('destination')}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="London"
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination Airport Code *</label>
            <input
              {...register('destinationAirport')}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              placeholder="LHR"
              maxLength={3}
            />
            {errors.destinationAirport && <p className="text-red-500 text-xs mt-1">{errors.destinationAirport.message}</p>}
          </div>
        </div>
      </div>
      
      {/* Schedule */}
      <div className="bg-yellow-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} /> Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departure Date *</label>
            <input
              {...register('departureDate')}
              type="date"
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure Time</label>
            <input
              {...register('departureTime')}
              type="time"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input {...register('isRoundTrip')} type="checkbox" className="rounded" />
              <span className="text-sm">Round Trip</span>
            </label>
          </div>
          {isRoundTrip && (
            <div>
              <label className="block text-sm font-medium mb-1">Return Date</label>
              <input
                {...register('returnDate')}
                type="date"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Contact */}
      <div className="bg-indigo-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mail size={20} /> Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              {...register('contactEmail')}
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="contact@example.com"
            />
            {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              {...register('contactPhone')}
              type="tel"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating...' : '✈️ Create Flight'}
      </button>
    </form>
  );
}
