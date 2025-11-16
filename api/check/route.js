export async function POST(req) {
  const { id } = await req.json();

  const res = await fetch("https://animexa-worker.onrender.com/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const data = await res.json();
  return Response.json(data);
}
