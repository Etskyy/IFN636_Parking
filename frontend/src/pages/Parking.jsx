import React from 'react';
import ParkingSlotForm from '../components/ParkingSlotForm';
import ParkingSlotList from '../components/ParkingSlotList';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';

const Parking = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Parking Slot Booking Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Add Parking Slot</h2>
          <ParkingSlotForm />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Create Booking</h2>
          <BookingForm />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Parking Slots</h2>
          <ParkingSlotList />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Bookings</h2>
          <BookingList />
        </div>
      </div>
    </div>
  );
};

export default Parking;