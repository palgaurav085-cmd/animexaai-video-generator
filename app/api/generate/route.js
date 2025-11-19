export async function POST(req) {
  const { prompt } = await req.json();

  // Step 1: create job
  const createJob = await fetch(
    "https://animexa-worker.palgaurav085.workers.dev/jobs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-worker-secret": process.env.WORKER_SECRET,
      },
      body: JSON.stringify({ script: prompt }),
    }
  );

  const jobData = await createJob.json();

  return Response.json({ id: jobData.jobId });
}
