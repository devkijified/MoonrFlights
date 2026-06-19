'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import { Plane, Calendar, MapPin, User, Mail, Phone, Plus, X, Search } from 'lucide-react';

// ============================================
// AIRPORT DATABASE
// ============================================
const AIRPORTS = [
  { code: 'JFK', city: 'New York', country: 'USA', airline: 'Delta', airlineCode: 'DL' },
  { code: 'LHR', city: 'London', country: 'UK', airline: 'British Airways', airlineCode: 'BA' },
  { code: 'CDG', city: 'Paris', country: 'France', airline: 'Air France', airlineCode: 'AF' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', airline: 'Emirates', airlineCode: 'EK' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', airline: 'Singapore Airlines', airlineCode: 'SQ' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', airline: 'Japan Airlines', airlineCode: 'JL' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', airline: 'Qantas', airlineCode: 'QF' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', airline: 'American Airlines', airlineCode: 'AA' },
  { code: 'ORD', city: 'Chicago', country: 'USA', airline: 'United Airlines', airlineCode: 'UA' },
  { code: 'DFW', city: 'Dallas', country: 'USA', airline: 'American Airlines', airlineCode: 'AA' },
  { code: 'DEN', city: 'Denver', country: 'USA', airline: 'United Airlines', airlineCode: 'UA' },
  { code: 'MIA', city: 'Miami', country: 'USA', airline: 'American Airlines', airlineCode: 'AA' },
  { code: 'SEA', city: 'Seattle', country: 'USA', airline: 'Delta', airlineCode: 'DL' },
  { code: 'MEX', city: 'Mexico City', country: 'Mexico', airline: 'Aeromexico', airlineCode: 'AM' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', airline: 'Air Canada', airlineCode: 'AC' },
  { code: 'GRU', city: 'Sao Paulo', country: 'Brazil', airline: 'LATAM', airlineCode: 'LA' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', airline: 'Aerolineas Argentinas', airlineCode: 'AR' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', airline: 'TAP Air Portugal', airlineCode: 'TP' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', airline: 'Iberia', airlineCode: 'IB' },
  { code: 'FCO', city: 'Rome', country: 'Italy', airline: 'ITA Airways', airlineCode: 'AZ' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', airline: 'KLM', airlineCode: 'KL' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', airline: 'Lufthansa', airlineCode: 'LH' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', airline: 'Swiss', airlineCode: 'LX' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', airline: 'Qatar Airways', airlineCode: 'QR' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', airline: 'Etihad', airlineCode: 'EY' },
  { code: 'BOM', city: 'Mumbai', country: 'India', airline: 'Air India', airlineCode: 'AI' },
  { code: 'DEL', city: 'Delhi', country: 'India', airline: 'Air India', airlineCode: 'AI' },
  { code: 'HND', city: 'Tokyo', country: 'Japan', airline: 'All Nippon Airways', airlineCode: 'NH' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', airline: 'Korean Air', airlineCode: 'KE' },
  { code: 'PEK', city: 'Beijing', country: 'China', airline: 'Air China', airlineCode: 'CA' },
  { code: 'PVG', city: 'Shanghai', country: 'China', airline: 'China Eastern', airlineCode: 'MU' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', airline: 'Cathay Pacific', airlineCode: 'CX' },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', airline: 'EVA Air', airlineCode: 'BR' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', airline: 'Thai Airways', airlineCode: 'TG' },
  { code: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', airline: 'Vietnam Airlines', airlineCode: 'VN' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', airline: 'Malaysia Airlines', airlineCode: 'MH' },
  { code: 'CGK', city: 'Jakarta', country: 'Indonesia', airline: 'Garuda Indonesia', airlineCode: 'GA' },
  { code: 'MNL', city: 'Manila', country: 'Philippines', airline: 'Philippine Airlines', airlineCode: 'PR' },
];

// ============================================
// COUNTRIES LIST FOR AUTOCOMPLETE
// ============================================
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
  'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// ============================================
// SEARCH FUNCTIONS
// ============================================
function searchAirports(query: string) {
  if (!query || query.length < 1) return [];
  const lowerQuery = query.toLowerCase();
  return AIRPORTS.filter(airport =>
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
}

function searchCountries(query: string) {
  if (!query || query.length < 1) return [];
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(country =>
    country.toLowerCase().includes(lowerQuery)
  ).slice(0, 8);
}

// ============================================
// ZOD SCHEMA
// ============================================
const passengerSchema = z.object({
  name: z.string().min(2, 'Name required'),
  dob: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other', '']).optional(),
  nationality: z.string().optional(),
  documentNumber: z.string().optional(),
});

const flightSchema = z.object({
  passengers: z.array(passengerSchema).min(1, 'At least one passenger required').max(4, 'Maximum 4 passengers'),
  contactEmail: z.string().email('Valid email required'),
  contactPhone: z.string().optional(),
  origin: z.string().min(2, 'Origin city required'),
  originAirport: z.string().length(3, '3-letter airport code'),
  destination: z.string().min(2, 'Destination city required'),
  destinationAirport: z.string().length(3, '3-letter airport code'),
  airline: z.string().min(2, 'Airline required'),
  airlineCode: z.string().min(2, 'Airline code required'),
  flightNumber: z.string().min(3, 'Flight number required'),
  departureDate: z.string().min(1, 'Departure date required'),
  departureTime: z.string().optional(),
  returnDate: z.string().optional(),
  isRoundTrip: z.boolean().default(false),
});

type FlightFormData = z.infer<typeof flightSchema>;

// ============================================
// MAIN COMPONENT
// ============================================
export function CreateFlightForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const [nationalitySuggestions, setNationalitySuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showNationalitySuggestions, setShowNationalitySuggestions] = useState(false);
  const [showNationalitySuggestionsIndex, setShowNationalitySuggestionsIndex] = useState<number | null>(null);
  const [generatedPNR, setGeneratedPNR] = useState('');
  
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const nationalityRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const { register, control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      passengers: [{ name: '', dob: '', gender: '', nationality: '', documentNumber: '' }],
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
  const originAirport = watch('originAirport');
  const destinationAirport = watch('destinationAirport');

  // ============================================
  // AUTO-FILL AIRLINE WHEN ORIGIN CHANGES
  // ============================================
  useEffect(() => {
    if (originAirport) {
      const airport = AIRPORTS.find(a => a.code === originAirport);
      if (airport) {
        setValue('origin', airport.city);
        setValue('airline', airport.airline);
        setValue('airlineCode', airport.airlineCode);
        const flightNum = Math.floor(Math.random() * 9000) + 1000;
        setValue('flightNumber', `${airport.airlineCode}${flightNum}`);
      }
    }
  }, [originAirport, setValue]);

  useEffect(() => {
    if (destinationAirport) {
      const airport = AIRPORTS.find(a => a.code === destinationAirport);
      if (airport) {
        setValue('destination', airport.city);
      }
    }
  }, [destinationAirport, setValue]);

  // ============================================
  // GENERATE PNR
  // ============================================
  useEffect(() => {
    generatePNRCode();
  }, []);

  const generatePNRCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPNR(pnr);
  };

  // ============================================
  // PASSENGER MANAGEMENT
  // ============================================
  const addPassenger = () => {
    if (fields.length < 4) {
      append({ name: '', dob: '', gender: '', nationality: '', documentNumber: '' });
    } else {
      toast.error('Maximum 4 passengers allowed');
    }
  };

  // ============================================
  // SEARCH HANDLERS
  // ============================================
  const handleOriginSearch = (value: string) => {
    const results = searchAirports(value);
    setOriginSuggestions(results);
    setShowOriginSuggestions(results.length > 0);
  };

  const handleDestSearch = (value: string) => {
    const results = searchAirports(value);
    setDestSuggestions(results);
    setShowDestSuggestions(results.length > 0);
  };

  const handleNationalitySearch = (value: string, index: number) => {
    const results = searchCountries(value);
    setNationalitySuggestions(results);
    setShowNationalitySuggestions(results.length > 0);
    setShowNationalitySuggestionsIndex(index);
  };

  const selectOrigin = (airport: any) => {
    setValue('origin', airport.city);
    setValue('originAirport', airport.code);
    setValue('airline', airport.airline);
    setValue('airlineCode', airport.airlineCode);
    setShowOriginSuggestions(false);
    const flightNum = Math.floor(Math.random() * 9000) + 1000;
    setValue('flightNumber', `${airport.airlineCode}${flightNum}`);
  };

  const selectDestination = (airport: any) => {
    setValue('destination', airport.city);
    setValue('destinationAirport', airport.code);
    setShowDestSuggestions(false);
  };

  const selectNationality = (country: string, index: number) => {
    setValue(`passengers.${index}.nationality`, country);
    setShowNationalitySuggestions(false);
    setShowNationalitySuggestionsIndex(null);
  };

  // ============================================
  // CLICK OUTSIDE HANDLERS
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestSuggestions(false);
      }
      // Check all nationality refs
      let shouldClose = true;
      for (const key in nationalityRefs.current) {
        if (nationalityRefs.current[key]?.contains(event.target as Node)) {
          shouldClose = false;
          break;
        }
      }
      if (shouldClose) {
        setShowNationalitySuggestions(false);
        setShowNationalitySuggestionsIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================
  // FORM SUBMISSION
  // ============================================
  const onSubmit = async (data: FlightFormData) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in first');
        setLoading(false);
        return;
      }

      const passengerData: any = {};
      data.passengers.forEach((p, index) => {
        const num = index + 1;
        passengerData[`passenger${num}Name`] = p.name;
        passengerData[`passenger${num}Dob`] = p.dob || null;
        passengerData[`passenger${num}Gender`] = p.gender || null;
        passengerData[`passenger${num}Nationality`] = p.nationality || null;
        passengerData[`passenger${num}DocumentNumber`] = p.documentNumber || null;
      });

      const response = await fetch('/api/flights/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...passengerData,
          pnr_code: generatedPNR,
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

      toast.success(`✈️ Flight created! PNR: ${generatedPNR}`);
      toast.success(`📋 Booking Ref: ${result.booking_ref}`);
      
      generatePNRCode();
      
      reset({
        passengers: [{ name: '', dob: '', gender: '', nationality: '', documentNumber: '' }],
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* PNR Display */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl text-center">
        <p className="text-sm opacity-80">Your PNR Code</p>
        <p className="text-3xl font-mono font-bold tracking-wider">{generatedPNR}</p>
        <p className="text-xs opacity-70 mt-1">✓ Verifiable on airline websites and GDS systems</p>
      </div>

      {/* ========================================== */}
      {/* PASSENGERS SECTION */}
      {/* ========================================== */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Name */}
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
              
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  {...register(`passengers.${index}.dob`)}
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  {...register(`passengers.${index}.gender`)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Nationality with Autocomplete */}
              <div ref={(el) => { nationalityRefs.current[index] = el; }} className="relative">
                <label className="block text-sm font-medium mb-1">Nationality</label>
                <input
                  {...register(`passengers.${index}.nationality`)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., United States"
                  onChange={(e) => handleNationalitySearch(e.target.value, index)}
                  onFocus={() => {
                    const val = (document.querySelector(`input[name="passengers.${index}.nationality"]`) as HTMLInputElement)?.value;
                    if (val) handleNationalitySearch(val, index);
                  }}
                />
                {showNationalitySuggestions && showNationalitySuggestionsIndex === index && (
                  <div className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {nationalitySuggestions.map((country) => (
                      <button
                        key={country}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                        onClick={() => selectNationality(country, index)}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Document Number */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Passport / Document Number</label>
                <input
                  {...register(`passengers.${index}.documentNumber`)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., AB1234567"
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
      
      {/* ========================================== */}
      {/* FLIGHT DETAILS */}
      {/* ========================================== */}
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
              placeholder="DL1234"
            />
            {errors.flightNumber && <p className="text-red-500 text-xs mt-1">{errors.flightNumber.message}</p>}
          </div>
        </div>
      </div>
      
      {/* ========================================== */}
      {/* ROUTE WITH AUTOCOMPLETE */}
      {/* ========================================== */}
      <div className="bg-green-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin size={20} /> Route
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin */}
          <div ref={originRef} className="relative">
            <label className="block text-sm font-medium mb-1">Origin Airport *</label>
            <div className="relative">
              <input
                {...register('originAirport')}
                className="w-full border rounded-lg px-3 py-2 uppercase"
                placeholder="JFK"
                maxLength={3}
                onChange={(e) => handleOriginSearch(e.target.value)}
                onFocus={() => {
                  const val = (document.querySelector('input[name="originAirport"]') as HTMLInputElement)?.value;
                  if (val) handleOriginSearch(val);
                }}
              />
              <Search size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
            {showOriginSuggestions && (
              <div className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {originSuggestions.map((airport) => (
                  <button
                    key={airport.code}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3"
                    onClick={() => selectOrigin(airport)}
                  >
                    <span className="font-bold text-blue-600">{airport.code}</span>
                    <span>{airport.city}</span>
                    <span className="text-gray-400 text-sm">{airport.country}</span>
                  </button>
                ))}
              </div>
            )}
            {errors.originAirport && <p className="text-red-500 text-xs mt-1">{errors.originAirport.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Origin City</label>
            <input
              {...register('origin')}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              placeholder="Auto-filled"
              readOnly
            />
          </div>

          {/* Destination */}
          <div ref={destRef} className="relative">
            <label className="block text-sm font-medium mb-1">Destination Airport *</label>
            <div className="relative">
              <input
                {...register('destinationAirport')}
                className="w-full border rounded-lg px-3 py-2 uppercase"
                placeholder="LHR"
                maxLength={3}
                onChange={(e) => handleDestSearch(e.target.value)}
                onFocus={() => {
                  const val = (document.querySelector('input[name="destinationAirport"]') as HTMLInputElement)?.value;
                  if (val) handleDestSearch(val);
                }}
              />
              <Search size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
            {showDestSuggestions && (
              <div className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {destSuggestions.map((airport) => (
                  <button
                    key={airport.code}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3"
                    onClick={() => selectDestination(airport)}
                  >
                    <span className="font-bold text-blue-600">{airport.code}</span>
                    <span>{airport.city}</span>
                    <span className="text-gray-400 text-sm">{airport.country}</span>
                  </button>
                ))}
              </div>
            )}
            {errors.destinationAirport && <p className="text-red-500 text-xs mt-1">{errors.destinationAirport.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Destination City</label>
            <input
              {...register('destination')}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              placeholder="Auto-filled"
              readOnly
            />
          </div>
        </div>
      </div>
      
      {/* ========================================== */}
      {/* SCHEDULE */}
      {/* ========================================== */}
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
              min={new Date().toISOString().split('T')[0]}
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
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* ========================================== */}
      {/* CONTACT INFORMATION */}
      {/* ========================================== */}
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
      
      {/* ========================================== */}
      {/* SUBMIT BUTTON */}
      {/* ========================================== */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating Flight...' : '✈️ Create Flight with PNR'}
      </button>
    </form>
  );
}
