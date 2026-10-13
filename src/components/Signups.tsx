import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Signup({ goToLogin }: { goToLogin: () => void }) {
  const { signup } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { theme, toggleTheme } = useTheme();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      await signup(username, password);
      setSuccess("Account created. You can now log in.");
      setTimeout(() => goToLogin(), 900);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Username is taken or an error occurred."
      );
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
        <h2>Create your account</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <div className="auth-field">
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setU(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setP(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>

        <p className="auth-footer">
          Already have an account?
          <button type="button" className="auth-link" onClick={goToLogin}>
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}
