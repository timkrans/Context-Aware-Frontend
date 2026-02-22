import { useState } from "react";
import api from "../api/api";

export default function Tabs({
  tabs,
  onSelect,
  reloadTabs,
  currentTabID,
}: {
  tabs: any[];
  onSelect: (id: number | null) => void;
  reloadTabs: () => void;
  currentTabID: number | null;
}) {
  const [newTab, setNewTab] = useState("");

  const createTab = async () => {
    if (!newTab.trim()) return;
    await api.post("/tabs", { tab_name: newTab });
    setNewTab("");
    reloadTabs();
  };

  const deleteTab = async (id: number) => {
    await api.delete(`/tabs/${id}`);
    reloadTabs();
    if (currentTabID === id) onSelect(null);
  };

  return (
    <>
      {tabs.map((t, index) => {
        const tabId = index + 1; 
        return (
          <div
            key={tabId}
            className="tab-item"
            onClick={() => onSelect(tabId)}
          >
            <span>{t.Name}</span>

            <span
              className="tab-delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteTab(tabId);
              }}
            >
              ✕
            </span>
          </div>
        );
      })}

      <input
        className="tab-input"
        placeholder="New tab"
        value={newTab}
        onChange={(e) => setNewTab(e.target.value)}
      />

      <button className="tab-add-btn" onClick={createTab}>
        Add Tab
      </button>
    </>
  );
}