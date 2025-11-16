const generateVideo = async () => {
  setLoading(true);
  setVideoUrl(null);

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: script })
  });

  const data = await res.json();

  // Polling for output until ready
  let prediction = data.prediction;

  while (prediction.status !== "succeeded" && prediction.status !== "failed") {
    await new Promise(r => setTimeout(r, 2000));

    const check = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        "Authorization": `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_KEY}`
      }
    });

    prediction = await check.json();
  }

  setLoading(false);
  setVideoUrl(prediction.output?.[0]);
};
