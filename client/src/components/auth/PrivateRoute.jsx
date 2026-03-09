import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. If no token or user, go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize roles to lowercase to prevent "Admin" vs "admin" bugs
  const userRole = user.role?.toLowerCase();
  const requiredRole = roleRequired?.toLowerCase();

  // 2. Role Check: Admin trying to access Citizen area
  // Redirect them to their own dashboard instead of home
  if (requiredRole === "citizen" && userRole !== "citizen") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // 3. Role Check: Citizen trying to access Admin area
  // Redirect back to landing page
  if (requiredRole === "admin" && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. Everything is fine, show the page
  return children;
};

export default PrivateRoute;