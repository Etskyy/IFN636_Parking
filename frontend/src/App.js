import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Parking from './pages/Parking';
import Admin from './pages/Admin';

const App = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? '/parking' : '/login'} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/parking" element={<Parking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;