"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please enter description");

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          scenes: [text],
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (data.error) {
        setError(data.error);
        return;
      }

      setVideoUrl(data.video_url);
    } catch (e) {
      setLoading(false);
      setError("Something went wrong: " + e.message);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "#fff",
        background: "#0A1437",
        minHeight: "100vh",
      }}
    >
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
          outline: "none",
        }}
      />

      {!loading && (
        <button
          onClick={handleGenerate}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#00C2FF",
            color: "#000",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Generate
        </button>
      )}

      {loading && (
        <button
          disabled
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#0077aa",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          Generating Video...
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: "30px",
            background: "#ff333344",
            padding: "20px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          ❌ Error: {error}
        </div>
      )}

      {/* Video Preview */}
      {videoUrl && (
        <div
          style={{
            marginTop: "40px",
            background: "#ffffff22",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Your Generated Video:</h3>

          <video
            controls
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "10px",
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          <a
            href={videoUrl}
            download="generated_video.mp4"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "12px 25px",
              background: "#00FFB3",
              color: "#000",
              borderRadius: "8px",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            ⬇ Download Video
          </a>
        </div>
      )}
    </div>
  );
}
