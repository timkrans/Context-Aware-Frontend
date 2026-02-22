import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login({ goToSignup }: { goToSignup: () => void }) {
  const { login } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  const submit = async () => {
    try {
      setError("");
      await login(username, password);
    } catch (err: any) {
      setError("Invalid login. Please check your username and password.");
    }
  };

  return (
    <div className="auth-container">
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <span className="theme-slider"></span>
      </label>

      <h2>Login</h2>

      {error && (
        <p style={{ color: "var(--danger)", marginBottom: "10px" }}>{error}</p>
      )}

      <input placeholder="Username" onChange={(e) => setU(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setP(e.target.value)}
      />

      <button onClick={submit}>Login</button>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don’t have an account?
        <span
          style={{ color: "#4a8cff", cursor: "pointer", marginLeft: "6px" }}
          onClick={goToSignup}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}