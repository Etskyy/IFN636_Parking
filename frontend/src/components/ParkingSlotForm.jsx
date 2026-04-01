import React, { useState } from 'react';
import axios from '../axiosConfig';

const ParkingSlotForm = () => {
  const [formData, setFormData] = useState({
    slotNumber: '',
    location: '',
    type: 'Standard',
    availability: true,
    pricePerHour: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/parking-slots', formData);
      setMessage('Parking slot created successfully');
      setError('');
      setFormData({
        slotNumber: '',
        location: '',
        type: 'Standard',
        availability: true,
        pricePerHour: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create parking slot');
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

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slot Number</label>
          <input
            type="text"
            name="slotNumber"
            placeholder="e.g. A1"
            value={formData.slotNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Level 1"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Standard">Standard</option>
              <option value="Compact">Compact</option>
              <option value="Disabled">Disabled</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour</label>
            <input
              type="number"
              name="pricePerHour"
              placeholder="5"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
          Mark slot as available
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Add Parking Slot
      </button>
    </form>
  );
};

export default ParkingSlotForm;