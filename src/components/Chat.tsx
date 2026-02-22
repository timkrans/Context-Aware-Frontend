import { useState } from "react";
import api from "../api/api";

type Message = { role: "user" | "ai"; text: string };

export default function Chat({
  tabID,
  history,
  setHistory,
}: {
  tabID: number;
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const [msg, setMsg] = useState("");
  const [reasoning, setReasoning] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;

    const userMessage = msg;

    //add user message
    setHistory((h) => [...h, { role: "user", text: userMessage }]);
    setMsg("");

    try {
      const res = await api.post("/chat", {
        tab_id: tabID,
        message: userMessage,
        reasoning: reasoning,
      });

      //add AI response
      setHistory((h) => [...h, { role: "ai", text: res.data.response }]);
    } catch (err) {
      //On error, add a message from AI indicating connection problem
      setHistory((h) => [
        ...h,
        { role: "ai", text: "Could not connect to the AI or embedding model." },
      ]);
    }
  };

  return (
    <>
      <div className="chat-window">
        {history.map((m, i) => (
          <div
            key={i}
            className={`message ${m.role === "user" ? "user-msg" : "ai-msg"}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Send a message..."
        />

        <button className="chat-send" onClick={send}>
          Send
        </button>
      </div>
      <div className="reasoning-toggle">
        <input
          type="checkbox"
          checked={reasoning}
          onChange={() => setReasoning(!reasoning)}
        />
        <label>Enable reasoning mode</label>
      </div>
    </>
  );
}