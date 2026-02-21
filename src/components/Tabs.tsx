import { useState } from "react";
import api from "../api/api";

export default function Tabs({
  tabs,
  onSelect,
  reloadTabs,
}: {
  tabs: any[];
  onSelect: (id: number) => void;
  reloadTabs: () => void;
}) {
  const [newTab, setNewTab] = useState("");

  const createTab = async () => {
    if (!newTab.trim()) return;
    await api.post("/tabs", { tab_name: newTab });
    setNewTab("");
    reloadTabs();
  };

  const deleteTab = async (index: number) => {
    await api.delete(`/tabs/${index}`);
    reloadTabs();
  };

  return (
    <>
      {tabs.map((t, index) => (
        <div
          key={index}
          className="tab-item"
          onClick={() => onSelect(index + 1)}
        >
          <span>{t.Name}</span>

          <span
            className="tab-delete"
            onClick={(e) => {
              e.stopPropagation();
              deleteTab(index + 1);
            }}
          >
            ✕
          </span>
        </div>
      ))}

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
