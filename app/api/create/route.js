import Replicate from "replicate";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-dev",
      input: {
        prompt: prompt,
        fps: 24,
        duration: 4,
        width: 512,
        height: 512
      }
    });

    if (!prediction || !prediction.id) {
      return Response.json(
        { error: "Replicate did not return prediction id" },
        { status: 500 }
      );
    }

    return Response.json({ id: prediction.id }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: "Create API Error", raw: err.message },
      { status: 500 }
    );
  }
}
