export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return Response.json({ error: "Prompt is required" }, { status: 400 });

    const WORKER_URL = "https://animexa-worker.palgaurav085.workers.dev/";

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const text = await res.text();

    // Try parse JSON safely (worker might return text)
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // fallback: treat entire response as video URL string
      data = { video: text };
    }

    // NORMALIZE scenes -> always array
    if (data) {
      if (Array.isArray(data.scenes)) {
        // ok
      } else if (typeof data.scenes === "string" && data.scenes.trim().length > 0) {
        data.scenes = [data.scenes];
      } else {
        data.scenes = [];
      }
    } else {
      data = { scenes: [], video: null };
    }

    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
