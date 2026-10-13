import { useState, type KeyboardEvent } from "react";
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

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createTab();
    }
  };

  return (
    <>
      <div className="tab-list">
        {tabs.map((t, index) => {
          const tabId = index + 1;
          const isActive = currentTabID === tabId;
          return (
            <div
              key={tabId}
              className={`tab-item${isActive ? " active" : ""}`}
              onClick={() => onSelect(tabId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(tabId);
                }
              }}
            >
              <span>{t.Name}</span>

              <span
                className="tab-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTab(tabId);
                }}
                role="button"
                aria-label={`Delete ${t.Name}`}
              >
                ✕
              </span>
            </div>
          );
        })}
      </div>

      <div className="tab-create">
        <input
          className="tab-input"
          placeholder="New tab name"
          value={newTab}
          onChange={(e) => setNewTab(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <button className="tab-add-btn" type="button" onClick={createTab}>
          Add Tab
        </button>
      </div>
    </>
  );
}
