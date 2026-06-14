'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { CreateFlightForm } from '@/components/flights/CreateFlightForm';
import { MyFlights } from '@/components/flights/MyFlights';
import { AuthButton } from '@/components/auth/AuthButton';
import { Moon, Plus, List } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'myflights'>('myflights');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/');
      } else {
        setUser(data.user);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/');
      } else {
        setUser(session.user);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, [router]);

  const handleFlightCreated = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('myflights');
    toast.success('Flight created successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Moon className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Moonr Flights</h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Dashboard</span>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>
      
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              My Flights
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'create' ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <CreateFlightForm onSuccess={handleFlightCreated} />
          </div>
        ) : (
          <MyFlights key={refreshKey} />
        )}
      </div>
    </div>
  );
}
