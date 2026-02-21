import { useState } from "react";
import api from "../api/api";

export default function FileUpload({ tabID }: { tabID: number }) {
  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("tab_id", String(tabID));

    await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Indexed!");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="upload-btn" onClick={upload}>Upload</button>
    </div>
  );
}
