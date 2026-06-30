import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  return (
    <main className="app">
      <AuthForm
        onLogin={() => {
          onLogin();
          navigate("/applications");
        }}
      />
    </main>
  );
}

export default LoginPage;