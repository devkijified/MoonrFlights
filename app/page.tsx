'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { AuthButton } from '@/components/auth/AuthButton';
import { Moon, Shield, FileText, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Moon className="text-blue-600" size={32} />
              <span className="text-2xl font-bold text-gray-900">Moonr Flights</span>
            </div>
            <AuthButton />
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
            <Shield size={16} />
            Legitimate Documentation Tool
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Flight Itineraries for
            <span className="text-blue-600"> Visa Applications</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create professional flight itineraries for travel planning, visa applications, 
            and documentation purposes. Clear disclaimers, fully traceable.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Free
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Moonr Flights?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional PDFs</h3>
              <p className="text-gray-600">Generate airline-style itinerary PDFs with all flight details</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visa Ready</h3>
              <p className="text-gray-600">Perfect for Schengen, UK, US, and Canadian visa applications</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free to Use</h3>
              <p className="text-gray-600">3 free itineraries per day, no credit card required</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-bold text-yellow-800 mb-2">⚠️ Important Notice</h3>
            <p className="text-sm text-yellow-700 mb-2">
              Moonr Flights generates DOCUMENTATION-ONLY itineraries. These are NOT real airline tickets.
            </p>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>No PNR exists in any airline reservation system</li>
              <li>Cannot be used for flight boarding or check-in</li>
              <li>For visa applications and travel planning only</li>
              <li>Some embassies may require verifiable PNR - verify before submitting</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
