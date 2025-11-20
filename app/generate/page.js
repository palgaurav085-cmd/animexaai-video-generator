"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please enter description");

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          scenes: [text]     // ← यह सबसे ज़रूरी लाइन है
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.error) {
        alert(`Server Error: ${data.error}`);
        return;
      }

      setResult(data);

    } catch (e) {
      setLoading(false);
      alert("Something went wrong: " + e.message);
    }
  };

  return (
    <div style={{ padding: "40px", color: "#fff", background: "#0A1437", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Generate Animation</h1>

      <textarea
        placeholder="A boy playing football..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          padding: "15px",
          borderRadius: "8px",
          fontSize: "18px",
          outline: "none"
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#00C2FF",
          color: "#000",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <div style={{ marginTop: "30px", background: "#fff2", padding: "20px", borderRadius: "8px" }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
