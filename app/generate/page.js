"use client";
import { useState } from "react";

export default function Generate() {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl(null);

    // dummy wait (later API add karenge)
    setTimeout(() => {
      setVideoUrl("https://samplelib.com/lib/preview/mp4/sample-5s.mp4");
      setLoading(false);
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#0A0F24",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "25px", fontSize: "38px" }}>
        🎬 AI Animation Generator
      </h1>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your script here…"
          style={{
            width: "100%",
            height: "180px",
            padding: "15px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #444",
            background: "#111727",
            color: "white",
            outline: "none",
          }}
        />

        <button
          onClick={generateVideo}
          disabled={loading || !script.trim()}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            borderRadius: "8px",
            backgroundColor: loading ? "#555" : "#00C2FF",
            color: "#000",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0px 0px 12px rgba(0, 194, 255, 0.4)",
            transition: "0.3s",
          }}
        >
          {loading ? "Generating…" : "🚀 Generate Animation"}
        </button>

        {videoUrl && (
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <h3>Your AI-Generated Video:</h3>
            <video controls width="100%" style={{ borderRadius: "10px" }}>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
