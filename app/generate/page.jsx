// paste/replace the generate function with this (complete robust version)

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

    // clear existing poll if any
    if (pollRef) {
      clearInterval(pollRef);
      setPollRef(null);
    }

    // start polling every 2.5s and save interval id so we can clear later
    const interval = setInterval(async () => {
      try {
        const statusRes = await fetch(`/api/status?id=${encodeURIComponent(id)}`);
        if (!statusRes.ok) {
          // handle non-json / non-200 gracefully
          const txt = await statusRes.text();
          console.error("Status endpoint returned non-OK:", txt);
          return;
        }
        const statusJson = await statusRes.json();

        console.log("poll:", id, statusJson);

        if (statusJson.status === "succeeded") {
          clearInterval(interval);
          setPollRef(null);
          setVideoUrl(statusJson.video_url || (statusJson.output && statusJson.output.video) || null);
          setStatus("done");
        } else if (statusJson.status === "failed" || statusJson.status === "canceled") {
          clearInterval(interval);
          setPollRef(null);
          setError("Generation failed: " + (statusJson.error || statusJson.status));
          setStatus("");
        } // else still processing, continue polling

      } catch (pollErr) {
        console.error("Polling error:", pollErr);
        clearInterval(interval);
        setPollRef(null);
        setError("Polling failed: " + pollErr.message);
        setStatus("");
      }
    }, 2500);

    setPollRef(interval);

  } catch (err) {
    console.error(err);
    setError(err.message || "Something went wrong");
    setStatus("");
  }
};

// also clear on unmount
useEffect(() => {
  return () => {
    if (pollRef) {
      clearInterval(pollRef);
    }
  };
}, [pollRef]);
