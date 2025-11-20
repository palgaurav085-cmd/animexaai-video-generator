export async function POST(req) {
  try {
    const body = await req.json();

    let prompt = body.prompt;
    let scenes = body.scenes;

    // fallback: scenes must be array
    if (!Array.isArray(scenes)) {
      scenes = [prompt];
    }

    const response = await fetch(
      "https://animexa-worker.palgaurav085.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          scenes
        })
      }
    );

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
