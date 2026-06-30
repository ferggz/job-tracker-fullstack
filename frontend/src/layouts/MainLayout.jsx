import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MainLayout({ children }) {
  const { logout } = useAuth();

  return (
    <main className="app">
      <section className="hero">
        <h1>Job Tracker</h1>
        <p>Track your job applications from one simple dashboard.</p>
      </section>

      <nav className="main-nav">
        <div>
          <NavLink to="/applications">Applications</NavLink>
          <NavLink to="/reminders">Reminders</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>

        <button onClick={logout}>Logout</button>
      </nav>

      {children}
    </main>
  );
}

export default MainLayout;