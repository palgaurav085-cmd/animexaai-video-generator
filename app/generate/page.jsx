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
      // 1️⃣ CREATE
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

      // 2️⃣ POLL STATUS
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

      // 3️⃣ DISPLAY RESULT
      setStatus("done");
      if (finalVideo) setVideoUrl(finalVideo);

    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      <h1>Generate Animation</h1>

      <textarea
        rows="6"
        style={{ width: "100%" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your animation prompt..."
      />

      <br /><br />

      <button onClick={handleGenerate}>Generate</button>

      <h3>Status: {status}</h3>

      {videoUrl && (
        <div>
          <h3>Result:</h3>
          <video src={videoUrl} controls width="100%" />
          <p><a href={videoUrl} target="_blank">Download Video</a></p>
        </div>
      )}
    </div>
  );
}
