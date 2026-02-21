import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ goToSignup }: { goToSignup: () => void }) {
  const { login } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  const submit = async () => {
    await login(username, password);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input placeholder="Username" onChange={(e) => setU(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setP(e.target.value)} />

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
