import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import HomeownerDashboard from "./pages/HomeownerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* ................................. protect role-based dashboards ................................. */}

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/homeowner/dashboard"
        element={
          <ProtectedRoute role="homeowner">
            <HomeownerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
