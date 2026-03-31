"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt) {
      setStatus("Please enter a prompt");
      return;
    }

    setLoading(true);
    setStatus("generating...");
    setVideoUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      // 🔥 IMPORTANT DEBUG PART
      const text = await res.text();
      console.log("API RESPONSE:", text);

      try {
        const data = JSON.parse(text);

        if (data.video) {
          setVideoUrl(data.video);
          setStatus("done");
        } else {
          setStatus("Error: " + text);
        }
      } catch {
        setStatus("RAW ERROR: " + text);
      }

    } catch (err) {
      setStatus("Error: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
        padding: "40px 20px",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h1 style={{ fontSize: "36px", color: "#ff70a6" }}>
          ✨ Anime Video Generator
        </h1>

        <textarea
          rows="6"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your anime scene..."
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            marginTop: "20px",
          }}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#ff70a6",
            border: "none",
            borderRadius: "25px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Video"}
        </button>

        <h3 style={{ marginTop: "20px" }}>
          Status: {status}
        </h3>

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            style={{ width: "100%", marginTop: "20px" }}
          />
        )}
      </div>
    </div>
  );
}
