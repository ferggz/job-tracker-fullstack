import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken")),
  );

  function handleLogout() {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />

      <Route
        path="/login"
        element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ApplicationsPage
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/applications" replace />} />
    </Routes>
  );
}

export default App;