import { useState } from "react"
import { loginUser, registerUser } from "../services/api"

function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    const user = { email, password }

    const data = isRegistering
      ? await registerUser(user)
      : await loginUser(user)

    if (data.access_token) {
      localStorage.setItem("accessToken", data.access_token)
      onLogin()
      return
    }

    if (isRegistering) {
      setIsRegistering(false)
      setError("User created. Please log in.")
      return
    }

    setError("Authentication failed.")
  }

  return (
    <section className="auth-card">
      <h1>{isRegistering ? "Create account" : "Login"}</h1>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="application-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
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
  )
}

export default AuthForm