import {
  BriefcaseBusiness,
  Clock3,
  LogOut,
  User,
} from "lucide-react";
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
          <NavLink to="/applications">
            <BriefcaseBusiness size={18} />
            <span>Applications</span>
          </NavLink>

          <NavLink to="/reminders">
            <Clock3 size={18} />
            <span>Reminders</span>
          </NavLink>

          <NavLink to="/profile">
            <User size={18} />
            <span>Profile</span>
          </NavLink>
        </nav>

        <button className="button-secondary logout-button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="app-content">{children}</main>
    </div>
  );
}

export default MainLayout;