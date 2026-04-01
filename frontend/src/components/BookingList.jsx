import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/bookings');
      setBookings(data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-gray-500">No bookings found.</p>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;