import Replicate from "replicate";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is missing" }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // WORKING MODEL + VERSION
    const prediction = await replicate.predictions.create({
      model: "zsxkib/animatediff-lightning",
      version: "e241f65848e31398c123c3fb485d7a69060670c8ca8a67c7ed2895f3ff8c8c5d",
      input: {
        prompt: prompt,
        steps: 30,
        fps: 24,
        num_frames: 32
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
