import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUser, registerUser } from "../services/api";

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
        localStorage.setItem("accessToken", data.access_token);
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
          ? "Could not create account."
          : "Invalid email or password.",
      );
    }
  }

  return (
    <section className="auth-card">
      <h1>{isRegistering ? "Create account" : "Login"}</h1>

      <form onSubmit={handleSubmit} className="application-form">
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
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Already have an account?" : "Create account"}
      </button>
    </section>
  );
}

export default AuthForm;