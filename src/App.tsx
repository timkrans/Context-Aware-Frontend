import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signups";
import Tabs from "./components/Tabs";
import FileUpload from "./components/FileUpload";
import { useAuth } from "./context/AuthContext";
import Chat from "./components/Chat";
import api from "./api/api";
import { useTheme } from "./context/ThemeContext";

type Message = { role: "user" | "ai"; text: string };

export default function App() {
  const { accessToken, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [tabID, setTabID] = useState<number | null>(null);
  const [authScreen, setAuthScreen] = useState<"login" | "signup">("login");
  const [history, setHistory] = useState<Message[]>([]);
  const [tabs, setTabs] = useState<any[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const loadTabs = async () => {
    const res = await api.get("/tabs");
    setTabs(res.data);
  };

  useEffect(() => {
    if (accessToken) loadTabs();
  }, [accessToken]);

  if (!accessToken) {
    return authScreen === "login" ? (
      <Login goToSignup={() => setAuthScreen("signup")} />
    ) : (
      <Signup goToLogin={() => setAuthScreen("login")} />
    );
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <h1 className="sidebar-brand">
          Context-Aware-<span>AI</span>
        </h1>
        <p className="sidebar-section-label">Contexts</p>
        <Tabs
          tabs={tabs}
          currentTabID={tabID}
          onSelect={(id) => {
            setTabID(id);
            setHistory([]);
          }}
          reloadTabs={loadTabs}
        />
        <div className="sidebar-actions">
          <button
            className="button-danger"
            type="button"
            onClick={() => {
              logout();
              setHistory([]);
              setTabID(null);
            }}
          >
            Logout
          </button>
          <label className="theme-switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
              aria-label="Toggle dark mode"
            />
            <span className="theme-slider" />
          </label>
        </div>
      </aside>

      <button
        className="toggle-sidebar-btn"
        type="button"
        aria-label={isSidebarCollapsed ? "Close sidebar" : "Open sidebar"}
        onClick={() => setIsSidebarCollapsed((prev) => !prev)}
      >
        {isSidebarCollapsed ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div className="chat-area">
        {tabID ? (
          <div className="chat-panel">
            <Chat tabID={tabID} history={history} setHistory={setHistory} />
            <FileUpload tabID={tabID} setHistory={setHistory} />
          </div>
        ) : (
          <div className="chat-window chat-empty">
            <h2>Select a context</h2>
            <p>Create or choose a tab from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
