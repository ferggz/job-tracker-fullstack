import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUser, registerUser, storeAuthTokens } from "../services/api";

function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const user = { email, password };

    try {
      const data = isRegistering
        ? await registerUser(user)
        : await loginUser(user);

      if (data.access_token) {
        storeAuthTokens(data);
        toast.success("Welcome back!");
        onLogin();
        return;
      }

      if (isRegistering) {
        setIsRegistering(false);
        toast.success("Account created successfully. Please log in.");
      }
    } catch {
      toast.error(
        isRegistering
          ? "Could not create account. Please try again."
          : "Could not connect to the server. Please try again in a few seconds."
      );
    }
  }

  return (
    <section className="auth-card">
      <h2>{isRegistering ? "Create account" : "Welcome back"}</h2>

      <p className="auth-subtitle">
        {isRegistering
          ? "Create your account to get started."
          : "Sign in to continue."}
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">
          {isRegistering ? "Create account" : "Login"}
        </button>
        </form>

        <p className="auth-footer">
          {isRegistering ? "Already have an account? " : "Don't have an account? "}

          <button
            type="button"
            className="auth-link"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Sign in" : "Create one"}
          </button>
        </p>
    </section>
  );
}

export default AuthForm;