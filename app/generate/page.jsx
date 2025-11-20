"use client";
export const runtime = "nodejs"; // CRITICAL FIX

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const startGeneration = async () => {
    setError("");
    setVideoUrl("");
    setStatus("creating");

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          scenes: [prompt]
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error("Create API Error: " + txt);
      }

      const data = await res.json();
      const id = data.id;

      setStatus("processing");

      const poll = async () => {
        try {
          const resp = await fetch(`/api/status?id=${id}`);
          const json = await resp.json();

          if (json.status === "succeeded") {
            setVideoUrl(json.video_url);
            setStatus("done");
            return;
          }

          if (json.status === "failed") {
            setError("Video generation failed.");
            setStatus("");
            return;
          }

          setTimeout(poll, 2500);

        } catch (pollErr) {
          setError("Polling Error: " + pollErr.message);
          setStatus(""); 
        }
      };

      poll();

    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("");
    }
  };

  return (
    <div style={{ padding: "40px", background: "#07102C", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: "32px" }}>Generate Animation</h1>

      <textarea
        style={{
          width: "100%",
          height: "180px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "16px",
          color: "black"
        }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your animation..."
      />

      <button
        onClick={startGeneration}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "#00AEEF",
          borderRadius: "8px",
          border: "none",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Generate
      </button>

      {status && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          Status: <b>{status}</b>
        </p>
      )}

      {error && (
        <div style={{
          marginTop: "20px",
          padding: "14px",
          background: "#8B1E2A",
          borderRadius: "6px"
        }}>
          ❌ {error}
        </div>
      )}

      {videoUrl && (
        <div style={{ marginTop: "30px" }}>
          <h2>Your Video:</h2>
          <video controls style={{ width: "100%", borderRadius: "10px" }}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}
