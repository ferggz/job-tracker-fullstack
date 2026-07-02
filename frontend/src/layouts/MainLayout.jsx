import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MainLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">JT</span>
          <div>
            <h1>Job Tracker</h1>
            <p>Application dashboard</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/applications">Applications</NavLink>
          <NavLink to="/reminders">Reminders</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="app-content">{children}</main>
    </div>
  );
}

export default MainLayout;