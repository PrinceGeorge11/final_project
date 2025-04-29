import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // Load token initially
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
      // Optional: Add logic here to verify the token on app load
      // e.g., make a request to a '/api/auth/me' endpoint
      // For simplicity, we'll just check if a token exists
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user'); // You'd store user info too
      if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
      }
      setLoading(false);
  }, []);

  const login = async (credentials) => {
      try {
          const response = await apiLogin(credentials);
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user)); // Store user details
          setToken(token);
          setUser(user);
          return user; // Indicate success
      } catch (error) {
          console.error("Login failed:", error.response?.data?.msg || error.message);
          logout(); // Clear any stale state
          throw error; // Re-throw to handle in component
      }
  };

  const register = async (userData) => {
      try {
          const response = await apiRegister(userData);
           const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setToken(token);
          setUser(user);
          return user;
      } catch (error) {
          console.error("Registration failed:", error.response?.data?.msg || error.message);
          logout();
          throw error;
      }
  };


  const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!token }}>
          {!loading && children} {/* Render children only after initial check */}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);