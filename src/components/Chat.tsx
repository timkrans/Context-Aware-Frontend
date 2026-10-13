import { useEffect, useRef, useState, type JSX, type KeyboardEvent } from "react";
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
  const [pending, setPending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [history, pending]);

  function applyBold(text: string) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    return text.replace(boldRegex, "<strong>$1</strong>");
  }

  function renderMessage(text: string) {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) {
        const bolded = applyBold(before);
        parts.push(
          <span
            key={`before-${match.index}`}
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: bolded }}
          />
        );
      }

      const codeContent = match[1].trim();

      parts.push(
        <div className="code-block" key={match.index}>
          <pre>
            <code>{codeContent}</code>
          </pre>
          <button
            className="copy-btn"
            type="button"
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
      const bolded = applyBold(after);
      parts.push(
        <span
          key="after"
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: bolded }}
        />
      );
    }

    return parts;
  }

  const send = async () => {
    if (!msg.trim() || pending) return;

    const userMessage = msg;

    setHistory((h) => [...h, { role: "user", text: userMessage }]);
    setMsg("");
    setPending(true);

    try {
      const res = await api.post("/chat", {
        tab_id: tabID,
        message: userMessage,
        reasoning: reasoning,
      });

      setHistory((h) => [...h, { role: "ai", text: res.data.response }]);
    } catch {
      setHistory((h) => [
        ...h,
        { role: "ai", text: "Could not connect to the AI or embedding model." },
      ]);
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <div className="chat-window" ref={chatRef}>
        {history.map((m, i) => (
          <div
            key={i}
            className={`message ${m.role === "user" ? "user-msg" : "ai-msg"}`}
          >
            {renderMessage(m.text)}
          </div>
        ))}
        {pending && (
          <div className="message ai-msg pending">Thinking…</div>
        )}
      </div>

      <div className="composer">
        <div className="chat-input-container">
          <textarea
            className="chat-input"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Send a message..."
            rows={1}
            disabled={pending}
          />

          <button
            className="chat-send"
            type="button"
            onClick={send}
            disabled={pending || !msg.trim()}
          >
            Send
          </button>
        </div>

        <div className="composer-meta">
          <label className="reasoning-toggle">
            <input
              type="checkbox"
              checked={reasoning}
              onChange={() => setReasoning(!reasoning)}
            />
            Reasoning mode
          </label>
        </div>
      </div>
    </>
  );
}
