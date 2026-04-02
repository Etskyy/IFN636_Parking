import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/auth/users');
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm({
      name: '',
      email: '',
      role: 'user',
    });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (userId) => {
    try {
      await axios.put(`/auth/users/${userId}`, editForm);
      setMessage('User updated successfully');
      setError('');
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      setMessage('');
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (!confirmDelete) return;

    try {
      await axios.delete(`/auth/users/${userId}`);
      setMessage('User deleted successfully');
      setError('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setMessage('');
    }
  };

  if (error && users.length === 0) {
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

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const isEditing = editingUserId === user._id;
            const isSelf = currentUser?._id === user._id;

            return (
              <div
                key={user._id}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Email"
                      />
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-2 rounded-lg"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(user._id)}
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
                ) : (
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {user.role || 'user'}
                        </span>
                        {isSelf && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>

                      {!isSelf && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserManagement;