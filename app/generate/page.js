"use client";

import { useState, useRef, useEffect } from "react";

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictionId, setPredictionId] = useState(null);
  const [status, setStatus] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const createJob = async () => {
    if (!text.trim()) return alert("Enter a prompt");

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatus("creating");
    setPredictionId(null);

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, scenes: [text] })
      });

      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setError(data.error);
        return;
      }

      setPredictionId(data.id);
      setStatus(data.status || "starting");
      // start polling
      startPolling(data.id);

    } catch (e) {
      setLoading(false);
      setError("Network error: " + e.message);
    }
  };

  const startPolling = (id) => {
    if (pollRef.current) clearInterval(pollRef.current);

    // poll immediately and then every 3s
    (async () => await checkStatus(id))();

    pollRef.current = setInterval(() => {
      checkStatus(id);
    }, 3000);
  };

  const checkStatus = async (id) => {
    try {
      const res = await fetch(`/api/status?id=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setStatus("error");
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }

      setStatus(data.status || data?.state || "unknown");

      if (data.status === "succeeded" && data.video_url) {
        setVideoUrl(data.video_url);
        if (pollRef.current) clearInterval(pollRef.current);
      }

      if (["failed", "canceled"].includes(data.status)) {
        setError("Generation failed or canceled.");
        if (pollRef.current) clearInterval(pollRef.current);
      }

    } catch (e) {
      setError("Status check failed: " + e.message);
      if (pollRef.current) clearInterval(pollRef.current);
    }
  };

  return (
    <div style={{ padding: 40, minHeight: "100vh", background: "#0A1437", color: "#fff" }}>
      <h1 style={{ fontSize: 32 }}>Generate Animation</h1>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="A boy playing football with friends"
        style={{ width: "100%", height: 160, padding: 12, marginTop: 16, fontSize: 16, borderRadius: 8 }}
      />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={createJob}
          disabled={loading}
          style={{ padding: "10px 18px", background: "#00C2FF", color: "#000", borderRadius: 8, fontWeight: 700 }}
        >
          {loading ? "Creating..." : "Generate"}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {status && <div style={{ marginBottom: 10 }}>Status: <strong>{status}</strong></div>}
        {predictionId && <div style={{ marginBottom: 10 }}>Job ID: {predictionId}</div>}
        {error && <div style={{ background: "#7b243f", padding: 12, borderRadius: 8 }}>❌ {error}</div>}
      </div>

      {videoUrl && (
        <div style={{ marginTop: 20, background: "#ffffff14", padding: 20, borderRadius: 8 }}>
          <h3>Your Video</h3>
          <video controls style={{ width: "100%", maxWidth: 800 }}>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div style={{ marginTop: 12 }}>
            <a href={videoUrl} download="generated.mp4" style={{ padding: "10px 16px", background: "#00FFB3", color: "#000", fontWeight: 700, borderRadius: 8, textDecoration: "none" }}>
              ⬇ Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
