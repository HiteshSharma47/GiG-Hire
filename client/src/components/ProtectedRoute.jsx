import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "/context/AuthContext";

function ProtectedRoute({ allowedRole }) {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
