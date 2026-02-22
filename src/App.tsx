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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // state for collapsing the sidebar
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
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <h3>Tabs</h3>
        <Tabs
          tabs={tabs}
          currentTabID={tabID}
          onSelect={(id) => {
            setTabID(id);
            setHistory([]); //clear chat when switching tabs
          }}
          reloadTabs={loadTabs}
        />
        <div className="sidebar-actions">
          <button className="button-danger" onClick={logout}>
            Logout
          </button>
          <label className="theme-switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="theme-slider"></span>
          </label>
        </div>
      </div>
      <div className="chat-area">
        {tabID ? (
          <>
            <Chat
              tabID={tabID}
              history={history}
              setHistory={setHistory}
            />
            <FileUpload tabID={tabID} setHistory={setHistory} />
          </>
        ) : (
          <div className="chat-window">
            <p>Select a tab to begin chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}