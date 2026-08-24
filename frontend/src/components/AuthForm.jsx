import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUser, registerUser, storeAuthTokens } from "../services/api";

function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const user = { email, password };
    const registering = isRegistering;

    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const data = registering
        ? await registerUser(user)
        : await loginUser(user);

      if (data.access_token) {
        storeAuthTokens(data);
        onLogin();
        return;
      }

      if (registering) {
        setIsRegistering(false);
        toast.success("Account created successfully. Please log in.");
      }
    } catch (error) {
      let message;

      if (!registering && error.status === 401) {
        message = "Incorrect email or password.";
      } else if (registering && error.status >= 400 && error.status < 500) {
        message = error.message === "Request failed"
          ? "Could not create account. Please check your details."
          : error.message;
      } else {
        message = "Could not connect to the server. Please try again.";
      }

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
        <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required aria-required="true" /></label>

        <label className="field"><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isRegistering ? "new-password" : "current-password"} required aria-required="true" /></label>

        {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}
        </button>
        </form>

        <p className="auth-footer">
          {isRegistering ? "Already have an account? " : "Don't have an account? "}

          <button
            type="button"
            className="auth-link"
            disabled={isSubmitting}
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMessage("");
            }}
          >
            {isRegistering ? "Sign in" : "Create account"}
          </button>
        </p>
    </section>
  );
}

export default AuthForm;
