import {
  BriefcaseBusiness,
  Clock3,
  LogOut,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function MainLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">JT</span>

          <div>
            <h1>Job Tracker</h1>
            <p>Application workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
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

        <button className="utility-button logout-button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="app-content">{children}</main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <NavLink to="/applications">
          <BriefcaseBusiness size={19} />
          <span>Applications</span>
        </NavLink>
        <NavLink to="/reminders">
          <Clock3 size={19} />
          <span>Reminders</span>
        </NavLink>
        <NavLink to="/profile">
          <User size={19} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default MainLayout;
