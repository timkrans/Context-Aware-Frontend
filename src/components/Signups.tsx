import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup({ goToLogin }: { goToLogin: () => void }) {
  const { signup } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  const submit = async () => {
    await signup(username, password);
    alert("Account created! You can now log in.");
    goToLogin();
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <input placeholder="Username" onChange={(e) => setU(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setP(e.target.value)} />

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
