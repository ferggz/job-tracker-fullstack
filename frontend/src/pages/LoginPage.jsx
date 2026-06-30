import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <main className="app">
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