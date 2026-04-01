import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const BookingForm = () => {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    slotId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const { data } = await axios.get('/parking-slots');
        const availableSlots = data.filter((slot) => slot.availability);
        setSlots(availableSlots);
      } catch (err) {
        setError('Failed to load parking slots');
      }
    };

    fetchSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/bookings', formData);
      setMessage('Booking created successfully');
      setError('');
      setFormData({
        slotId: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <select
        name="slotId"
        value={formData.slotId}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select Parking Slot</option>
        {slots.map((slot) => (
          <option key={slot._id} value={slot._id}>
            {slot.slotNumber} - {slot.location}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="bookingDate"
        value={formData.bookingDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="time"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Booking
      </button>
    </form>
  );
};

export default BookingForm;