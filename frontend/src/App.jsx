import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Milestones from './pages/Milestones';
import Tips from './pages/Tips';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { login, register } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route path="/register" element={<Register onRegister={register} />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/milestones" element={<PrivateRoute><Milestones /></PrivateRoute>} />
      <Route path="/milestones/:id/tips" element={<PrivateRoute><Tips /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Box mt={2}>
          <AppRoutes />
        </Box>
      </Router>
    </AuthProvider>
  );
}
