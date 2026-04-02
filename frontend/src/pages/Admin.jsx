import React from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ParkingSlotForm from '../components/ParkingSlotForm';
import ParkingSlotList from '../components/ParkingSlotList';
import BookingList from '../components/BookingList';

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/parking" replace />;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">
            Manage parking slots and review bookings across the system.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Parking Slot</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create new parking spaces for users to reserve.
            </p>
            <ParkingSlotForm />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">All Bookings</h3>
            <p className="text-sm text-gray-500 mb-4">
              View all reservations made through the application.
            </p>
            <BookingList />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">All Parking Slots</h3>
          <p className="text-sm text-gray-500 mb-4">
            Review all parking slots in the system.
          </p>
          <ParkingSlotList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Admin;