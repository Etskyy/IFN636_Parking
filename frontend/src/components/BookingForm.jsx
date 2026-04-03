import React, { useEffect, useMemo, useState } from 'react';
import axios from '../axiosConfig';

const BookingForm = () => {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    slotId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    licensePlate: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const timeOptions = useMemo(() => {
    const options = [];

    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');
        options.push(`${hh}:${mm}`);
      }
    }

    return options;
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const { data } = await axios.get('/parking-slots');
        // only show spots that admins have not disabled
        setSlots(data.filter((slot) => slot.availability));
        setError('');
      } catch (err) {
        setError('Failed to load parking spots');
      }
    };

    fetchSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === 'startTime' && updated.endTime && updated.endTime <= value) {
        updated.endTime = '';
      }

      return updated;
    });
  };

  const availableEndTimes = useMemo(() => {
    if (!formData.startTime) return timeOptions;
    return timeOptions.filter((time) => time > formData.startTime);
  }, [formData.startTime, timeOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startTime || !formData.endTime) {
      setError('Please select both a start time and end time');
      setMessage('');
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError('End time must be after start time');
      setMessage('');
      return;
    }

    try {
      await axios.post('/bookings', formData);
      setMessage('Booking created successfully');
      setError('');
      setFormData({
        slotId: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        licensePlate: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spot</label>
        <select
          name="slotId"
          value={formData.slotId}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Parking Spot</option>
          {slots.map((slot) => (
            <option key={slot._id} value={slot._id}>
              {slot.slotNumber} - {slot.location}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
        <input
          type="text"
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleChange}
          placeholder="e.g. 123ABC"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <select
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Start Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">30-minute intervals only</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <select
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select End Time</option>
            {availableEndTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Choose any duration in 30-minute blocks</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Book Parking Spot
      </button>
    </form>
  );
};

export default BookingForm;