"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl(null);

    // Start generation
    const start = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: script })
    });

    const { id } = await start.json();

    let finished = false;
    let output = null;

    while (!finished) {
      await new Promise(r => setTimeout(r, 2000));

      const check = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const result = await check.json();

      if (result.status === "succeeded") {
        finished = true;
        output = result.output?.[0];
      }

      if (result.status === "failed") {
        finished = true;
        output = null;
      }
    }

    setLoading(false);
    setVideoUrl(output);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>Generate Animation Video</h1>

      <textarea
        placeholder="Paste your script here..."
        value={script}
        onChange={(e) => setScript(e.target.value)}
        style={{ width: "100%", height: 150, padding: 10 }}
      />

      <button
        onClick={generateVideo}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "12px 25px",
          background: "#0070f3",
          color: "white",
          borderRadius: 8
        }}
      >
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          autoPlay
          style={{ marginTop: 30, width: "100%", borderRadius: 10 }}
        ></video>
      )}
    </div>
  );
}
