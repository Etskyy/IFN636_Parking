import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const ParkingSlotList = () => {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get('/parking-slots');
      setSlots(data);
      setError('');
    } catch (err) {
      setError('Failed to load parking slots');
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No parking slots found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {slots.map((slot) => (
        <div
          key={slot._id}
          className={`rounded-xl border-2 p-4 text-center transition ${
            slot.availability
              ? 'border-blue-200 bg-blue-50'
              : 'border-gray-200 bg-gray-100'
          }`}
        >
          <div
            className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center font-bold ${
              slot.availability ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
            }`}
          >
            P
          </div>
          <p className="font-semibold text-gray-900">{slot.slotNumber}</p>
          <p className="text-xs text-gray-500">{slot.location}</p>
          <p className="text-xs text-gray-500 mt-1">{slot.type}</p>
          <p className="text-xs mt-2">
            <span
              className={`px-2 py-1 rounded-full ${
                slot.availability
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {slot.availability ? 'Available' : 'Booked'}
            </span>
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2">${slot.pricePerHour}/hr</p>
        </div>
      ))}
    </div>
  );
};

export default ParkingSlotList;