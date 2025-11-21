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

    // Correct model + version
    const prediction = await replicate.predictions.create({
      model: "zubairkhan/animatediff-lightning",
      version: "48ad11c4c0e143b7da1e3de3bc577f40297f6e6c2b943b7bf0530bb694ff2c55",
      input: {
        prompt: prompt,
        steps: 30
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
