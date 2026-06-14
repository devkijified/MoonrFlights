'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Calendar, MapPin, Download, Trash2, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface FlightCardProps {
  flight: any;
  isAdmin?: boolean;
  onDelete?: () => void;
  onRefresh?: () => void;
}

export function FlightCard({ flight, isAdmin, onDelete, onRefresh }: FlightCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: flight.id }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itinerary-${flight.booking_ref}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded successfully!');
      onRefresh?.();
    } catch (error: any) {
      console.error('PDF Error:', error);
      toast.error(error.message || 'Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase.from('flights').delete().eq('id', flight.id);
      if (error) throw error;
      
      toast.success('Flight deleted successfully');
      onDelete?.();
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete flight');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-xs opacity-80">Booking Reference</p>
            <p className="text-white font-mono font-bold text-lg tracking-wider">
              {flight.booking_ref}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white text-sm opacity-80">{flight.airline}</p>
            <p className="text-white font-mono font-bold text-lg">
              {flight.flight_number}
            </p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        {/* Route */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="font-semibold text-gray-900">
                  {flight.origin} ({flight.origin_airport})
                </p>
              </div>
            </div>
            
            <Plane size={20} className="text-blue-500 mx-2" />
            
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">To</p>
                <p className="font-semibold text-gray-900">
                  {flight.destination} ({flight.destination_airport})
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Departure</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(flight.departure_date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Passenger Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Passenger</p>
              <p className="font-medium text-gray-900">{flight.passenger_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="font-medium text-gray-900">
                {format(new Date(flight.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
            {flight.passenger_email && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{flight.passenger_email}</p>
              </div>
            )}
            {isAdmin && flight.profiles && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">User</p>
                <p className="font-medium text-gray-900">{flight.profiles.email}</p>
              </div>
            )}
            {flight.is_round_trip && (
              <div className="col-span-2">
                <p className="text-xs text-blue-600">✓ Round Trip</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Download size={18} />
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="bg-yellow-50 px-6 py-3 border-t border-yellow-100">
        <p className="text-xs text-yellow-700 text-center">
          ⚠️ DOCUMENTATION ONLY - Not a real ticket. Cannot be used for boarding.
        </p>
      </div>
    </div>
  );
}
