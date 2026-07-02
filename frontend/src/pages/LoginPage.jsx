import { BriefcaseBusiness, Clock3, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <span className="brand-mark">JT</span>

        <h1>Job Tracker</h1>

        <p>
          Track every opportunity from one clean, modern dashboard.
        </p>

        <ul>
          <li>
            <BriefcaseBusiness size={18} />
            <span>Manage your applications</span>
          </li>

          <li>
            <Clock3 size={18} />
            <span>Never miss an interview</span>
          </li>

          <li>
            <FileText size={18} />
            <span>Store multiple CVs</span>
          </li>
        </ul>
      </section>

      <AuthForm
        onLogin={() => {
          login();
          navigate("/applications");
        }}
      />
    </main>
  );
}

export default LoginPage;