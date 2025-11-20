"use client";
export const runtime = "nodejs"; // IMPORTANT: Replicate needs Node runtime

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const generate = async () => {
    setError("");
    setVideoUrl("");
    setStatus("creating");

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          scenes: [prompt]
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("API Error: " + text);
      }

      let data = await res.json();
      const id = data.id;
      setStatus("processing");

      // Polling the status API
      const pollStatus = async () => {
        const statusRes = await fetch(`/api/status?id=${id}`);
        const statusData = await statusRes.json();

        if (statusData.status === "succeeded") {
          setVideoUrl(statusData.video_url);
          setStatus("done");
        } else if (statusData.status === "failed") {
          setError("Video generation failed");
          setStatus("");
        } else {
          setTimeout(pollStatus, 2500);
        }
      };

      pollStatus();

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setStatus("");
    }
  };

  return (
    <div style={{ padding: "40px", color: "white", background: "#07102C", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Generate Animation</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your animation..."
        style={{
          width: "100%",
          height: "200px",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "16px",
          color: "#000"
        }}
      />

      <button
        onClick={generate}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#00AEEF",
          color: "white",
          borderRadius: "8px",
          fontSize: "18px",
          border: "none"
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
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#8B1E2A",
            color: "white",
            borderRadius: "6px"
          }}
        >
          ❌ {error}
        </div>
      )}

      {videoUrl && (
        <div style={{ marginTop: "30px" }}>
          <h2>Generated Video:</h2>
          <video src={videoUrl} controls style={{ width: "100%", borderRadius: "10px" }} />
        </div>
      )}
    </div>
  );
}
