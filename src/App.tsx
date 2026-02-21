import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signups";
import Tabs from "./components/Tabs";
import FileUpload from "./components/FileUpload";
import { useAuth } from "./context/AuthContext";
import Chat from "./components/Chat";
import api from "./api/api";

type Message = { role: "user" | "ai"; text: string };

export default function App() {
  const { accessToken, logout } = useAuth();

  const [tabID, setTabID] = useState<number | null>(null);
  const [authScreen, setAuthScreen] = useState<"login" | "signup">("login");

  const [history, setHistory] = useState<Message[]>([]);
  const [tabs, setTabs] = useState<any[]>([]);

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
      <div className="sidebar">
        <h3>Tabs</h3>

        <Tabs
          tabs={tabs}
          onSelect={(id) => {
            setTabID(id);
            setHistory([]); //clear chat when switching tabs
          }}
          reloadTabs={loadTabs}
        />

        <button className="button-danger" onClick={logout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>

      <div className="chat-area">
        {tabID ? (
          <>
            <Chat
              tabID={tabID}
              history={history}
              setHistory={setHistory}
            />
            <FileUpload tabID={tabID} />
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

