// components/flights/FlightCard.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Calendar, MapPin, Download, Trash2, Plane, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, isValid, parseISO } from 'date-fns';

// Helper function to safely format dates
function safeFormatDate(dateString: string, formatStr: string = 'MMM dd, yyyy') {
  if (!dateString) return 'Invalid date';
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatStr);
  } catch {
    return 'Invalid date';
  }
}

export function FlightCard({ flight, isAdmin, onDelete, onRefresh }: FlightCardProps) {
  // ... rest of your component code

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* ... rest of your JSX */}
      
      {/* In the route section */}
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-gray-400" />
        <div>
          <p className="text-xs text-gray-500">Departure</p>
          <p className="font-semibold text-gray-900">
            {safeFormatDate(flight.departure_date)}
          </p>
        </div>
      </div>
      
      {/* ... rest of your JSX */}
    </div>
  );
}
