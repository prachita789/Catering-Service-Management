import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {

  // Get user and loading state from AuthContext
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until authentication state finishes loading
  if (loading) {
    return null; 
  }

  // If user not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // If admin route and user is not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
