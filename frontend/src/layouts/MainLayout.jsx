import { NavLink } from "react-router-dom";

function MainLayout({ onLogout, children }) {
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

        <button onClick={onLogout}>Logout</button>
      </nav>

      {children}
    </main>
  );
}

export default MainLayout;