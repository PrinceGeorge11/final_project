import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './componenets/ProtectedRoute';
import { useAuth } from './contexts/AuthContext'; // Assuming context


function App() {
  const { isAuthenticated } = useAuth(); // Get auth state

  return (
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

           {/* Add other public/protected routes here */}

          {/* Redirect base path */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

          {/* Optional: 404 Not Found Route */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
  );
}

export default App;