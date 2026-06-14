'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { CreateFlightForm } from '@/components/flights/CreateFlightForm';
import { MyFlights } from '@/components/flights/MyFlights';
import { Moon, Plus, List, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'myflights' | 'create'>('myflights');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    router.push('/');
  };

  const handleFlightCreated = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('myflights');
    toast.success('Flight created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Moon className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Moonr Flights</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('myflights')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === 'myflights'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={18} />
              My Flights ({refreshKey})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === 'create'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus size={18} />
              Create Flight
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'create' ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <CreateFlightForm onSuccess={handleFlightCreated} />
          </div>
        ) : (
          <MyFlights refreshKey={refreshKey} />
        )}
      </div>
    </div>
  );
}
