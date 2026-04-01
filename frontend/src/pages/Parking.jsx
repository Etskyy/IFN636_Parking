import React from 'react';
import AppLayout from '../components/AppLayout';
import ParkingSlotForm from '../components/ParkingSlotForm';
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
            Manage parking slots and create bookings from one dashboard.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Search and Create Booking</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select an available parking slot and confirm a booking.
          </p>
          <BookingForm />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Parking Slot</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create a new parking space for users to reserve.
            </p>
            <ParkingSlotForm />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">My Bookings</h3>
            <p className="text-sm text-gray-500 mb-4">
              View active and previous parking reservations.
            </p>
            <BookingList />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Available Parking Slots</h3>
          <p className="text-sm text-gray-500 mb-4">
            Review all parking spaces currently stored in the system.
          </p>
          <ParkingSlotList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Parking;