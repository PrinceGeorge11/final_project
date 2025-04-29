import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed

// Can optionally accept required roles
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Optional: Show a loading spinner while checking auth state
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for roles if provided
  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) {
      // Optional: Redirect to an unauthorized page or back to dashboard
      console.warn(`User role ${user?.role} not authorized for this route.`);
      return <Navigate to="/dashboard" state={{ message: "Unauthorized" }} replace />; // Or a dedicated /unauthorized page
  }


  return children; // Render the children components (e.g., DashboardPage)
};

export default ProtectedRoute;