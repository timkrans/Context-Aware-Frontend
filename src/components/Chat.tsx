import { useState, type JSX } from "react";
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
  function renderMessage(text: string) {
  const codeBlockRegex = /```([\s\S]*?)```/g;

  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) {
      parts.push(<span style={{ whiteSpace: "pre-wrap" }}>{before}</span>);
    }

    const codeContent = match[1].trim();

    parts.push(
      <div className="code-block" key={match.index}>
        <pre>
          <code>{codeContent}</code>
        </pre>
        <button
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(codeContent)}
        >
          Copy
        </button>
      </div>
    );

    lastIndex = codeBlockRegex.lastIndex;
  }

  const after = text.slice(lastIndex);
  if (after) {
    parts.push(<span style={{ whiteSpace: "pre-wrap" }}>{after}</span>);
  }

  return parts;
}
  const send = async () => {
    if (!msg.trim()) return;

    const userMessage = msg;

    setHistory((h) => [...h, { role: "user", text: userMessage }]);
    setMsg("");

    try {
      const res = await api.post("/chat", {
        tab_id: tabID,
        message: userMessage,
        reasoning: reasoning,
      });

      setHistory((h) => [...h, { role: "ai", text: res.data.response }]);
    } catch (err) {
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
            {renderMessage(m.text)}
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
