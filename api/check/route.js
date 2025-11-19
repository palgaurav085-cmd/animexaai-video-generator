export async function POST(req) {
  const { id } = await req.json();

  const check = await fetch(
    `https://animexa-worker.palgaurav085.workers.dev/jobs/${id}`,
    {
      headers: {
        "x-worker-secret": process.env.WORKER_SECRET,
      },
    }
  );

  const data = await check.json();

  return Response.json(data);
}
