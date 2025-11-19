export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const res = await fetch("https://animexa-worker.palgaurav085.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
