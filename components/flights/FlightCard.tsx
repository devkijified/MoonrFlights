'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Calendar, MapPin, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface FlightCardProps {
  flight: any;
  isAdmin?: boolean;
  onDelete?: () => void;
  onRefresh?: () => void;
}

export function FlightCard({ flight, isAdmin, onDelete, onRefresh }: FlightCardProps) {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const generatePDF = async () => {
    setGeneratingPdf(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: flight.id }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
        toast.success('PDF generated!');
        onRefresh?.();
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this flight?')) {
      const { error } = await supabase.from('flights').delete().eq('id', flight.id);
      if (error) {
        toast.error('Failed to delete');
      } else {
        toast.success('Flight deleted');
        onDelete?.();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm opacity-90">Booking Reference</p>
            <p className="text-white font-mono font-bold text-lg">{flight.booking_ref}</p>
          </div>
          <div className="text-right">
            <p className="text-white text-sm opacity-90">{flight.airline}</p>
            <p className="text-white font-mono font-bold">{flight.flight_number}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {flight.origin} ({flight.origin_airport}) → {flight.destination} ({flight.destination_airport})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {format(new Date(flight.departure_date), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Passenger</p>
              <p className="font-medium">{flight.passenger_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-medium">{format(new Date(flight.created_at), 'MMM dd, yyyy')}</p>
            </div>
            {isAdmin && flight.profiles && (
              <div className="col-span-2">
                <p className="text-gray-500">User</p>
                <p className="font-medium">{flight.profiles.email}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={generatePDF}
            disabled={generatingPdf}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={16} />
            {generatingPdf ? 'Generating...' : 'Download PDF'}
          </button>
          
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="bg-yellow-50 px-6 py-3 border-t border-yellow-100">
        <p className="text-xs text-yellow-700 text-center">
          ⚠️ DOCUMENTATION ONLY - Not a real ticket. Cannot be used for boarding.
        </p>
      </div>
    </div>
  );
}
