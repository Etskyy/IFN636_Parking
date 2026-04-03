import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const ParkingSlotList = () => {
  const [slots, setSlots] = useState([]);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editForm, setEditForm] = useState({
    slotNumber: '',
    location: '',
    type: 'Standard',
    availability: true,
    pricePerHour: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isAdmin = currentUser?.role === 'admin';

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get('/parking-slots');
      setSlots(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load parking spots');
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const startEdit = (slot) => {
    setEditingSlotId(slot._id);
    setEditForm({
      slotNumber: slot.slotNumber || '',
      location: slot.location || '',
      type: slot.type || 'Standard',
      availability: !!slot.availability,
      pricePerHour: slot.pricePerHour ?? '',
    });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditForm({
      slotNumber: '',
      location: '',
      type: 'Standard',
      availability: true,
      pricePerHour: '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async (slotId) => {
    try {
      await axios.put(`/parking-slots/${slotId}`, editForm);
      setMessage('Parking spot updated successfully');
      setError('');
      setEditingSlotId(null);
      fetchSlots();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update parking spot');
      setMessage('');
    }
  };

  const handleDelete = async (slotId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this parking spot?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/parking-slots/${slotId}`);
      setMessage('Parking spot deleted successfully');
      setError('');
      fetchSlots();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete parking spot');
      setMessage('');
    }
  };

  if (error && slots.length === 0) {
    return <p className="text-red-500">{error}</p>;
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No parking spots found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const isEditing = editingSlotId === slot._id;

          if (isEditing) {
            return (
              <div
                key={slot._id}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slot Number
                  </label>
                  <input
                    type="text"
                    name="slotNumber"
                    value={editForm.slotNumber}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Compact">Compact</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Hour
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={editForm.pricePerHour}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={editForm.availability}
                    onChange={handleEditChange}
                  />
                  Enabled for bookings
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(slot._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={slot._id}
              className="rounded-xl border-2 p-4 transition border-blue-200 bg-blue-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{slot.slotNumber}</p>
                  <p className="text-sm text-gray-500">{slot.location}</p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    slot.availability
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {slot.availability ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p><span className="font-medium">Type:</span> {slot.type}</p>
                <p><span className="font-medium">Price:</span> ${slot.pricePerHour}/hr</p>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => startEdit(slot)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slot._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParkingSlotList;