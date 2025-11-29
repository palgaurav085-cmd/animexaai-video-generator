"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  async function handleGenerate() {
    setStatus("creating...");
    setVideoUrl("");

    try {
      const createRes = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const createData = await createRes.json();

      if (!createData.id) {
        setStatus("Create Error: " + JSON.stringify(createData));
        return;
      }

      const predictionId = createData.id;
      setStatus("processing...");

      let finalVideo = null;

      while (true) {
        const statusRes = await fetch(`/api/status?id=${predictionId}`);
        const statusData = await statusRes.json();

        if (statusData.output && statusData.output.video) {
          finalVideo = statusData.output.video;
        }

        if (statusData.status === "succeeded") break;
        if (statusData.status === "failed") {
          setStatus("failed");
          return;
        }

        await new Promise((res) => setTimeout(res, 3000));
      }

      setStatus("done");
      if (finalVideo) setVideoUrl(finalVideo);

    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
        padding: "40px 20px",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
        textShadow: "0 0 10px rgba(255,255,255,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.03)",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 25px rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "#ff70a6",
            textShadow: "0 0 15px rgba(255, 112, 166, 0.7)",
          }}
        >
          ✨ Anime Video Generator
        </h1>

        <textarea
          rows="6"
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: "16px",
            outline: "none",
            marginBottom: "20px",
            boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          }}
          placeholder="Describe your anime scene…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          style={{
            padding: "12px 28px",
            background: "linear-gradient(45deg, #ff70a6, #ff9770)",
            border: "none",
            borderRadius: "30px",
            color: "#fff",
            fontSize: "18px",
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(255,112,166,0.6)",
            transition: "0.2s",
          }}
        >
          Generate Video
        </button>

        <h3 style={{ marginTop: "20px", fontSize: "18px", color: "#90e0ef" }}>
          Status: <span style={{ color: "#caf0f8" }}>{status}</span>
        </h3>

        {videoUrl && (
          <div style={{ marginTop: "30px" }}>
            <h2
              style={{
                color: "#ff70a6",
                textShadow: "0 0 12px rgba(255,112,166,0.8)",
              }}
            >
              🎬 Your Anime Video
            </h2>

            <video
              src={videoUrl}
              controls
              style={{
                width: "100%",
                borderRadius: "20px",
                marginTop: "15px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />

            <a
              href={videoUrl}
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: "15px",
                color: "#ff70a6",
                textDecoration: "underline",
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
