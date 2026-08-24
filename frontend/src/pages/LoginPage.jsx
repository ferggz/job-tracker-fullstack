import { BriefcaseBusiness, Clock3, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <span className="brand-mark" aria-hidden="true">JT</span>

        <h1>Job Tracker</h1>

        <p>
          A focused workspace for every application, reminder, and CV.
        </p>

        <ul>
          <li>
            <BriefcaseBusiness size={18} />
            <span>Scan applications quickly</span>
          </li>

          <li>
            <Clock3 size={18} />
            <span>Keep follow-ups visible</span>
          </li>

          <li>
            <FileText size={18} />
            <span>Keep both CVs ready</span>
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
