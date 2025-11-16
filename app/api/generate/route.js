import Replicate from "replicate";

export async function POST(req) {
  const { prompt } = await req.json();

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });

  const prediction = await replicate.predictions.create({
    version: "YOUR_MODEL_VERSION_ID",
    input: { prompt }
  });

  return Response.json({ id: prediction.id });
}
