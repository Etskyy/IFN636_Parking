import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from '../axiosConfig';

const BookingList = ({ splitByTime = false, scope = 'mine' }) => {
  const [bookings, setBookings] = useState([]);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editForm, setEditForm] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    licensePlate: '',
    status: 'active',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isAdmin = currentUser?.role === 'admin';

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

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await axios.get(`/bookings?scope=${scope}`);
      setBookings(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    }
  }, [scope]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const bookingEndDateTime = useCallback((booking) => {
    const date = new Date(booking.bookingDate);
    const [endHour = '0', endMinute = '0'] = (booking.endTime || '00:00').split(':');
    date.setHours(Number(endHour), Number(endMinute), 0, 0);
    return date;
  }, []);

  const isPastBooking = useCallback((booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') return true;
    return bookingEndDateTime(booking) < new Date();
  }, [bookingEndDateTime]);

  const canEditOrCancel = (booking) => {
    return !isPastBooking(booking) && booking.status === 'active';
  };

  const startEdit = (booking) => {
    const bookingDateValue = booking.bookingDate
      ? new Date(booking.bookingDate).toISOString().split('T')[0]
      : '';

    setEditingBookingId(booking._id);
    setEditForm({
      bookingDate: bookingDateValue,
      startTime: booking.startTime || '',
      endTime: booking.endTime || '',
      licensePlate: booking.licensePlate || '',
      status: booking.status || 'active',
    });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingBookingId(null);
    setEditForm({
      bookingDate: '',
      startTime: '',
      endTime: '',
      licensePlate: '',
      status: 'active',
    });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const availableEndTimes = useMemo(() => {
    if (!editForm.startTime) return timeOptions;
    return timeOptions.filter((time) => time > editForm.startTime);
  }, [editForm.startTime, timeOptions]);

  const handleUpdate = async (bookingId) => {
    try {
      await axios.put(`/bookings/${bookingId}`, editForm);
      setMessage('Booking updated successfully');
      setError('');
      setEditingBookingId(null);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking');
      setMessage('');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    try {
      await axios.put(`/bookings/${bookingId}/cancel`);
      setMessage('Booking cancelled successfully');
      setError('');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      setMessage('');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/bookings/${bookingId}`);
      setMessage('Booking deleted successfully');
      setError('');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
      setMessage('');
    }
  };

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const aDate = new Date(a.bookingDate);
      const bDate = new Date(b.bookingDate);
      return bDate - aDate;
    });
  }, [bookings]);

  const { presentBookings, pastBookings } = useMemo(() => {
    const present = [];
    const past = [];

    sortedBookings.forEach((booking) => {
      if (isPastBooking(booking)) {
        past.push(booking);
      } else {
        present.push(booking);
      }
    });

    return { presentBookings: present, pastBookings: past };
  }, [sortedBookings, isPastBooking]);

  const renderBookingCard = (booking) => {
    const isEditing = editingBookingId === booking._id;
    const editable = canEditOrCancel(booking);

    if (isEditing) {
      return (
        <div
          key={booking._id}
          className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3"
        >
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
              <input
                type="date"
                name="bookingDate"
                value={editForm.bookingDate}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                name="licensePlate"
                value={editForm.licensePlate}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <select
                name="startTime"
                value={editForm.startTime}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="">Select Start Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <select
                name="endTime"
                value={editForm.endTime}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="">Select End Time</option>
                {availableEndTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {isAdmin && scope === 'all' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleUpdate(booking._id)}
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
      <div key={booking._id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <p className="font-semibold text-gray-900">
              {booking.slotId?.slotNumber || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              {booking.slotId?.location || 'Unknown location'}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              booking.status === 'active'
                ? 'bg-green-100 text-green-700'
                : booking.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <p>
            <span className="font-medium">Date:</span>{' '}
            {new Date(booking.bookingDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">User:</span> {booking.userId?.name || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Start:</span> {booking.startTime}
          </p>
          <p>
            <span className="font-medium">End:</span> {booking.endTime}
          </p>
          <p>
            <span className="font-medium">Plate:</span> {booking.licensePlate || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Spot Type:</span> {booking.slotId?.type || 'N/A'}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          {editable && (
            <>
              <button
                onClick={() => startEdit(booking)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Cancel Booking
              </button>
            </>
          )}

          {isAdmin && scope === 'all' && (
            <button
              onClick={() => handleDeleteBooking(booking._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (title, items) => (
    <div className="space-y-3">
      <h4 className="text-md font-semibold text-gray-900">{title}</h4>
      {items.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        items.map(renderBookingCard)
      )}
    </div>
  );

  if (error && bookings.length === 0) {
    return <p className="text-red-500">{error}</p>;
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

      {splitByTime ? (
        <div className="space-y-6">
          {renderSection('Current / Upcoming Bookings', presentBookings)}
          {renderSection('Past / Completed Bookings', pastBookings)}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBookings.length === 0 ? (
            <p className="text-gray-500">No bookings found.</p>
          ) : (
            sortedBookings.map(renderBookingCard)
          )}
        </div>
      )}
    </div>
  );
};

export default BookingList;