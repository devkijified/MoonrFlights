'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plane, Trash2, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  origin: string;
  origin_airport: string;
  destination: string;
  destination_airport: string;
  departure_date: string;
  passenger_name: string;
  booking_ref: string;
  created_at: string;
}

export function MyFlights({ refreshKey }: { refreshKey: number }) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlights();
  }, [refreshKey]);

  const loadFlights = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('flights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setFlights(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this flight?')) {
      const { error } = await supabase.from('flights').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete');
      } else {
        toast.success('Flight deleted');
        await loadFlights();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Plane size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No flights yet</h3>
        <p className="text-gray-500">Create your first flight itinerary above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <div key={flight.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-xs opacity-90">Booking Reference</p>
                <p className="text-white font-mono font-bold">{flight.booking_ref}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">{flight.airline}</p>
                <p className="text-white font-mono">{flight.flight_number}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-gray-400" />
                <span>{flight.origin} ({flight.origin_airport}) → {flight.destination} ({flight.destination_airport})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-gray-400" />
                <span>{format(new Date(flight.departure_date), 'MMM dd, yyyy')}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Passenger: {flight.passenger_name}
            </div>
            
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <button
                onClick={() => handleDelete(flight.id)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
