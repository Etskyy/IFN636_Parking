import React from 'react';
import AppLayout from '../components/AppLayout';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-500 mb-6">View your account information.</p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-medium text-gray-900">{user?.name || 'N/A'}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;