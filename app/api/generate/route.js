export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    // --- YOUR CLOUDLARE WORKER URL ---
    const WORKER_URL = "https://animexa-worker.palgaurav085.workers.dev/generate";

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return Response.json(data);

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
