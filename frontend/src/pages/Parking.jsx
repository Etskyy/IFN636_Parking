import React from 'react';
import AppLayout from '../components/AppLayout';
import ParkingSlotList from '../components/ParkingSlotList';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';

const Parking = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isAdmin = user?.role === 'admin';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Book a Parking Spot</h2>
          <p className="text-gray-600">
            Browse available parking spaces and create bookings.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Create Booking</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select an available parking slot and reserve it.
          </p>
          <BookingForm />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {isAdmin ? 'All Bookings' : 'My Bookings'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {isAdmin
              ? 'View all bookings made in the system.'
              : 'View your parking reservations.'}
          </p>
          <BookingList />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Parking Spots</h3>
          <p className="text-sm text-gray-500 mb-4">
            View all parking spots currently stored in the system.
          </p>
          <ParkingSlotList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Parking;