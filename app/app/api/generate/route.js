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

      const data = await res.json();

      if (data.video) {
        setVideoUrl(data.video);
        setStatus("done");
      } else {
        setStatus("Error: " + JSON.stringify(data));
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
          boxShadow: "0 0 25px rgba(0,0,0,0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "#ff70a6",
          }}
        >
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
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            fontSize: "16px",
            outline: "none",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "12px 25px",
            background: loading
              ? "#555"
              : "linear-gradient(45deg, #ff70a6, #ff9770)",
            border: "none",
            borderRadius: "25px",
            color: "#fff",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Video"}
        </button>

        <h3 style={{ marginTop: "20px" }}>
          Status: <span>{status}</span>
        </h3>

        {videoUrl && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#ff70a6" }}>🎬 Your Video</h2>

            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              style={{
                width: "100%",
                borderRadius: "15px",
                marginTop: "15px",
              }}
            />

            <a
              href={videoUrl}
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: "10px",
                color: "#ff70a6",
              }}
            >
              ⬇ Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
