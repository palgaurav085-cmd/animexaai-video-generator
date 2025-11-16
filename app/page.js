"use client";
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
