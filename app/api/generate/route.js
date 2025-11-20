export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch(
      "https://animexa-worker.palgaurav085.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      }
    );

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
