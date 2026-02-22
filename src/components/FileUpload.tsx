import { useState } from "react";
import api from "../api/api";

type Message = { role: "user" | "ai"; text: string };

export default function FileUpload({
  tabID,
  setHistory,
}: {
  tabID: number;
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("tab_id", String(tabID));

    try {
      await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //success message from AI
      setHistory((h) => [
        ...h,
        { role: "ai", text: `File "${file.name}" successfully indexed.` },
      ]);

      setFile(null); 
    } catch (err) {
      setHistory((h) => [
        ...h,
        {
          role: "ai",
          text: `Could not upload file "${file?.name}": issue connecting to the embedding model.`,
        },
      ]);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button className="upload-btn" onClick={upload}>
        Upload
      </button>
    </div>
  );
}