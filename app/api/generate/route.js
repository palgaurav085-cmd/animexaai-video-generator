export async function POST(req) {
  const { prompt } = await req.json();

  const res = await fetch("https://animexa-worker.onrender.com/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  return Response.json(data);
}
