import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function ProtectedRoute({ children, role }) {
  const { user } = useApp();

  // ........................ check if the user is logged in ........................

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ........................................ check the user's role .......................

  if (role && user.role !== role) {
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    return <Navigate to="/homeowner/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
