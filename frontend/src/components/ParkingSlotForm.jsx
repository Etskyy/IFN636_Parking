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
    <form onSubmit={handleSubmit} className="space-y-3">
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="slotNumber"
        placeholder="Slot Number"
        value={formData.slotNumber}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="Standard">Standard</option>
        <option value="Compact">Compact</option>
        <option value="Disabled">Disabled</option>
        <option value="Electric">Electric</option>
      </select>

      <input
        type="number"
        name="pricePerHour"
        placeholder="Price Per Hour"
        value={formData.pricePerHour}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="availability"
          checked={formData.availability}
          onChange={handleChange}
        />
        Available
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Slot
      </button>
    </form>
  );
};

export default ParkingSlotForm;