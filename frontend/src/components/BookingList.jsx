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

  return (
    <div>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="border rounded p-3">
              <p>
                <strong>Slot:</strong>{' '}
                {booking.slotId?.slotNumber || 'N/A'}
              </p>
              <p>
                <strong>Location:</strong>{' '}
                {booking.slotId?.location || 'N/A'}
              </p>
              <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p><strong>Start:</strong> {booking.startTime}</p>
              <p><strong>End:</strong> {booking.endTime}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p>
                <strong>User:</strong>{' '}
                {booking.userId?.name || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;