'use client';

import { useEffect, useState } from 'react';
import { supabase, getUserFlights, isAdmin, getAllFlights } from '@/lib/supabase/client';
import { FlightCard } from './FlightCard';
import { Plane, AlertCircle, RefreshCw } from 'lucide-react';
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
  passenger_email: string;
  booking_ref: string;
  created_at: string;
  is_round_trip: boolean;
  user_id: string;
  profiles?: { email: string; full_name: string };
}

export function MyFlights({ refreshKey }: { refreshKey: number }) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFlights();
    checkAdmin();
  }, [refreshKey]);

  const checkAdmin = async () => {
    const admin = await isAdmin();
    setAdminMode(admin);
  };

  const loadFlights = async () => {
    setLoading(true);
    try {
      const admin = await isAdmin();
      let data;
      
      if (admin) {
        data = await getAllFlights();
        console.log('Admin flights loaded:', data?.length);
      } else {
        data = await getUserFlights();
        console.log('User flights loaded:', data?.length);
      }
      
      setFlights(data || []);
    } catch (error) {
      console.error('Error loading flights:', error);
      toast.error('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFlights();
    setRefreshing(false);
    toast.success('Flights refreshed');
  };

  const handleDelete = (deletedId: string) => {
    setFlights(flights.filter(f => f.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Loading your flights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      {adminMode && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-700">
              <AlertCircle size={20} />
              <span className="font-semibold">Admin Mode</span>
              <span className="text-sm">Viewing {flights.length} total flight{flights.length !== 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      )}
      
      {/* Stats */}
      {flights.length > 0 && (
        <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Total Flights</span>
              <p className="text-2xl font-bold text-gray-900">{flights.length}</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      )}
      
      {/* Flight List */}
      {flights.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights yet</h3>
          <p className="text-gray-500 mb-6">Create your first flight itinerary to get started!</p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <span>Click "Create Flight" above</span>
            <span>→</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              isAdmin={adminMode}
              onDelete={() => handleDelete(flight.id)}
              onRefresh={loadFlights}
            />
          ))}
        </div>
      )}
    </div>
  );
}
