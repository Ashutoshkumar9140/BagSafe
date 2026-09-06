import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function ProtectedRoute({ children, role }) {
  const { user } = useApp();

  // ........................ block dashboard access without a login ........................
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ........................ send users to the dashboard for their own role ................
  if (role && user.role !== role) {
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    return <Navigate to="/homeowner/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
