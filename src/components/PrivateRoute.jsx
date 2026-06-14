// PrivateRoute — redirects unauthenticated users to /login
// Usage: wrap any page that requires authentication
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // No token found — redirect to login
  // replace: prevents /dashboard from appearing in browser history
  if (!token) return <Navigate to="/login" replace />;

  return children;
}