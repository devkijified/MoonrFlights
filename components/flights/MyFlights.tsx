'use client';

import { useEffect, useState } from 'react';
import { supabase, getUserFlights, isAdmin, getAllFlights } from '@/lib/supabase/client';
import { FlightCard } from './FlightCard';
import { Plane, AlertCircle } from 'lucide-react';

export function MyFlights() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    loadFlights();
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const admin = await isAdmin();
    setAdminMode(admin);
  };

  const loadFlights = async () => {
    setLoading(true);
    const admin = await isAdmin();
    
    let data;
    if (admin) {
      data = await getAllFlights();
    } else {
      data = await getUserFlights();
    }
    
    setFlights(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('flights').delete().eq('id', id);
    if (!error) {
      setFlights(flights.filter(f => f.id !== id));
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
    <div className="space-y-6">
      {adminMode && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-purple-700">
            <AlertCircle size={20} />
            <span className="font-semibold">Admin Mode</span>
            <span className="text-sm">Viewing all user flights</span>
          </div>
        </div>
      )}
      
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
    </div>
  );
}
