function MainLayout({ onLogout, children }) {
  return (
    <main className="app">
      <section className="hero">
        <h1>Job Tracker</h1>
        <p>Track your job applications from one simple dashboard.</p>
      </section>

      <button onClick={onLogout}>Logout</button>

      {children}
    </main>
  );
}

export default MainLayout;