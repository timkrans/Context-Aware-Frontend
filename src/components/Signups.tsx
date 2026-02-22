import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Signup({ goToLogin }: { goToLogin: () => void }) {
  const { signup } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState(""); 
  const { theme, toggleTheme } = useTheme();

  const submit = async () => {
    try {
      setError("");
      await signup(username, password);
      alert("Account created! You can now log in.");
      goToLogin();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        "Username is taken or an error occurred."
      );
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

      <h2>Create Account</h2>

      {error && (
        <p style={{ color: "var(--danger)", marginBottom: "10px" }}>{error}</p>
      )}

      <input placeholder="Username" onChange={(e) => setU(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setP(e.target.value)}
      />

      <button onClick={submit}>Sign Up</button>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account?
        <span
          style={{ color: "#4a8cff", cursor: "pointer", marginLeft: "6px" }}
          onClick={goToLogin}
        >
          Log in
        </span>
      </p>
    </div>
  );
}