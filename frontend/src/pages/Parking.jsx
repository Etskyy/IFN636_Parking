import React from 'react';
import AppLayout from '../components/AppLayout';
import ParkingSlotList from '../components/ParkingSlotList';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';

const Parking = () => {
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
            Select an available parking slot, enter your license plate, and reserve it.
          </p>
          <BookingForm />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">My Bookings</h3>
          <p className="text-sm text-gray-500 mb-4">
            View your bookings separated into current and past reservations.
          </p>
          <BookingList splitByTime={true} />
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