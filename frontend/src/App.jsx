import { Navigate, Route, Routes } from "react-router-dom";
import "./redesign.css";
import LoginPage from "./pages/LoginPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RemindersPage from "./pages/RemindersPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <RemindersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/applications" replace />} />
    </Routes>
  );
}

export default App;
