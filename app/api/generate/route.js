export async function POST(req) {
  const { prompt } = await req.json();

  const res = await fetch("https://animexa-worker.palgaurav085.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  return new Response(await res.text(), {
    headers: { "Content-Type": "application/json" },
  });
}
