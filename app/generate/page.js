"use client";
import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const generate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a script!");
      return;
    }

    setLoading(true);
    setVideoURL(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Server Error: " + data.error);
        setLoading(false);
        return;
      }

      setVideoURL(data.video);
    } catch (err) {
      alert("Failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>
      <h1>Generate Animation Video</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your animation script..."
        style={{ width: "100%", height: "150px", padding: "10px" }}
      />

      <button
        onClick={generate}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {videoURL && (
        <div style={{ marginTop: "30px" }}>
          <h3>Your Video</h3>
          <video controls width="100%">
            <source src={videoURL} type="video/mp4" />
          </video>

          <a
            href={videoURL}
            download="animation.mp4"
            style={{ display: "block", marginTop: "10px" }}
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
