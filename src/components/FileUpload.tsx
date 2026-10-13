import { useId, useState } from "react";
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
  const [uploading, setUploading] = useState(false);
  const inputId = useId();

  const upload = async () => {
    if (!file || uploading) return;

    const form = new FormData();
    form.append("file", file);
    form.append("tab_id", String(tabID));

    setUploading(true);
    try {
      await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setHistory((h) => [
        ...h,
        { role: "ai", text: `File "${file.name}" successfully indexed.` },
      ]);

      setFile(null);
    } catch {
      setHistory((h) => [
        ...h,
        {
          role: "ai",
          text: `Could not upload file "${file?.name}": issue connecting to the embedding model.`,
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <label
        className={`file-upload-label${file ? " has-file" : ""}`}
        htmlFor={inputId}
      >
        {file ? file.name : "Choose a file to index…"}
      </label>
      <input
        id={inputId}
        className="file-upload-input"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={uploading}
      />
      <button
        className="upload-btn"
        type="button"
        onClick={upload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
    </div>
  );
}
