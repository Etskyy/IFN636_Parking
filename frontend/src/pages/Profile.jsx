import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import axios from '../axiosConfig';

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [user, setUser] = useState(storedUser);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [formData, setFormData] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/auth/login', {
        email: user.email,
        password: passwordCheck,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);

      setUser(data);
      setIsVerified(true);
      setMessage('Password verified. You can now edit your profile.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password verification failed');
      setMessage('');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setMessage('');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const { data } = await axios.put('/auth/profile', payload);

      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);

      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        password: '',
        confirmPassword: '',
      });

      setMessage('Profile updated successfully');
      setError('');
      setIsVerified(false);
      setPasswordCheck('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setMessage('');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-500 mb-6">View and manage your account information.</p>

          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-medium text-gray-900">{user?.name || 'N/A'}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">{user?.email || 'N/A'}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-medium text-gray-900">{user?.role || 'user'}</p>
            </div>
          </div>

          {!isVerified ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Verify Password to Edit</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Verify Password
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsVerified(false);
                    setPasswordCheck('');
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      password: '',
                      confirmPassword: '',
                    });
                    setMessage('');
                    setError('');
                  }}
                  className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;