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

  return (
    <div>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {slots.length === 0 ? (
        <p>No parking slots found.</p>
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => (
            <div key={slot._id} className="border rounded p-3">
              <p><strong>Slot:</strong> {slot.slotNumber}</p>
              <p><strong>Location:</strong> {slot.location}</p>
              <p><strong>Type:</strong> {slot.type}</p>
              <p><strong>Available:</strong> {slot.availability ? 'Yes' : 'No'}</p>
              <p><strong>Price/Hour:</strong> ${slot.pricePerHour}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParkingSlotList;