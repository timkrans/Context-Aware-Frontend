import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login({ goToSignup }: { goToSignup: () => void }) {
  const { login } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await login(username, password);
    } catch {
      setError("Invalid login. Please check your username and password.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-container" onSubmit={submit}>
        <label className="theme-switch auth-theme">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
          <span className="theme-slider" />
        </label>

        <p className="auth-brand">
          Context-Aware-<span>AI</span>
        </p>
        <h2>Sign in to continue</h2>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-field">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setU(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setP(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        <p className="auth-footer">
          Don’t have an account?
          <button type="button" className="auth-link" onClick={goToSignup}>
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
