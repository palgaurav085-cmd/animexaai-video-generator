import Replicate from "replicate";

export async function POST(req) {
  const { id } = await req.json();

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY
  });

  const prediction = await replicate.predictions.get(id);

  return Response.json(prediction);
}
