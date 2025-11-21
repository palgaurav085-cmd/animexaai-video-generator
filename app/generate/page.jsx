"use client";

import { useState, useEffect } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const [pollRef, setPollRef] = useState(null);

  const startGeneration = async () => {
    setError("");
    setVideoUrl("");
    setStatus("creating");

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, scenes: [prompt] }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Create API Error: " + text);
      }

      const data = await res.json();
      const id = data?.id;

      if (!id) {
        throw new Error("No prediction id returned from /api/create");
      }

      setStatus("processing");

      // clear previous poller
      if (pollRef) clearInterval(pollRef);

      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/status?id=${id}`);
          if (!statusRes.ok) return;

          const statusJson = await statusRes.json();

          if (statusJson.status === "succeeded") {
            clearInterval(interval);
            setPollRef(null);

            setVideoUrl(
              statusJson.video_url ||
                statusJson?.output?.video ||
                null
            );

            setStatus("done");
          } else if (
            statusJson.status === "failed" ||
            statusJson.status === "canceled"
          ) {
            clearInterval(interval);
            setPollRef(null);
            setError("Generation failed");
            setStatus("");
          }
        } catch (err) {
          clearInterval(interval);
          setPollRef(null);
          setError("Polling error: " + err.message);
          setStatus("");
        }
      }, 2500);

      setPollRef(interval);
    } catch (err) {
      setError(err.message);
      setStatus("");
    }
  };

  // clear poller on unmount
  useEffect(() => {
    return () => {
      if (pollRef) clearInterval(pollRef);
    };
  }, [pollRef]);

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h1>Generate Animation</h1>

      <textarea
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: "150px", marginBottom: "20px" }}
      />

      <button onClick={startGeneration}>Generate</button>

      <p>Status: {status}</p>

      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          ❌ {error}
        </div>
      )}

      {videoUrl && (
        <video controls style={{ marginTop: "20px", width: "100%" }}>
          <source src={videoUrl} />
        </video>
      )}
    </div>
  );
}
