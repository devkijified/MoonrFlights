'use client';

import { useState } from 'react';
import { User, Plus, X } from 'lucide-react';

interface Passenger {
  name: string;
  dob: string;
}

export function MultiPassengerForm({ onChange }: { onChange: (passengers: Passenger[]) => void }) {
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: '', dob: '' } // First passenger required
  ]);

  const addPassenger = () => {
    if (passengers.length < 4) {
      setPassengers([...passengers, { name: '', dob: '' }]);
    }
  };

  const removePassenger = (index: number) => {
    if (index > 0) { // Can't remove first passenger
      const newPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(newPassengers);
      onChange(newPassengers);
    }
  };

  const updatePassenger = (index: number, field: 'name' | 'dob', value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
    onChange(newPassengers);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Passengers (up to 4)</h3>
        {passengers.length < 4 && (
          <button
            onClick={addPassenger}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            <Plus size={16} />
            Add Passenger
          </button>
        )}
      </div>

      {passengers.map((passenger, index) => (
        <div key={index} className="relative bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium flex items-center gap-2">
              <User size={16} />
              Passenger {index + 1} {index === 0 && <span className="text-xs text-red-500">*</span>}
            </span>
            {index > 0 && (
              <button
                onClick={() => removePassenger(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name {index === 0 && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={passenger.name}
                onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="John Doe"
                required={index === 0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={passenger.dob}
                onChange={(e) => updatePassenger(index, 'dob', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-500">
        {passengers.length} of 4 passengers added
      </p>
    </div>
  );
}
