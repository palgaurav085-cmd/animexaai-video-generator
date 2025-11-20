"use client";
import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [scenes, setScenes] = useState([]);

  const generate = async () => {
    if (!prompt.trim()) {
      alert("Please type script");
      return;
    }
    setLoading(true);
    setVideoURL(null);
    setScenes([]);

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

      // Ensure scenes is array
      const s = Array.isArray(data.scenes) ? data.scenes : (data.scenes ? [data.scenes] : []);
      setScenes(s);

      // video may be string or object
      const vid = typeof data.video === "string" ? data.video : (data.video?.url || null);
      setVideoURL(vid);
    } catch (err) {
      alert("Network/Server failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: "auto" }}>
      <h1>Generate Animation Video</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: 140 }}
        placeholder="Type script..."
      />

      <div style={{ marginTop: 16 }}>
        <button onClick={generate} disabled={loading} style={{ padding: "10px 18px" }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {scenes.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Scenes</h3>
          <ol>
            {scenes.map((s, i) => (<li key={i}>{s}</li>))}
          </ol>
        </div>
      )}

      {videoURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Video</h3>
          <video controls style={{ width: "100%" }}>
            <source src={videoURL} type="video/mp4" />
          </video>
          <a href={videoURL} download style={{ display: "block", marginTop: 8 }}>
            Download
          </a>
        </div>
      )}
    </div>
  );
}
