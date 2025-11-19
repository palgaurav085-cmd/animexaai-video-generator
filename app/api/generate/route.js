export async function POST(req) {
  const { prompt } = await req.json();

  const res = await fetch("https://animexa-worker.palgaurav085.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ script: prompt })
  });

  const data = await res.json();
  return Response.json(data);
}
