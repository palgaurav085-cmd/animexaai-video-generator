export const runtime = "nodejs"; // IMPORTANT: Replicate API requires Node.js runtime

export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = body.prompt;
    const scenes = Array.isArray(body.scenes) ? body.scenes : [prompt];

    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

    if (!REPLICATE_API_TOKEN) {
      return Response.json(
        { error: "Missing REPLICATE_API_TOKEN" },
        { status: 500 }
      );
    }

    const finalPrompt = scenes.join(", ");

    // Create a new prediction job
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "7f706cb4227e314b43b464f50a0c86bb1a8f7bd94b2074fa3437ea0c8d575f7c",
        input: {
          prompt: finalPrompt,
          fps: 24,
          num_frames: 96,
          resolution: "1280x720",
        },
      }),
    });

    const result = await response.json();

    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    // Return the prediction ID
    return Response.json({
      id: result.id,
      status: result.status,
      prompt: finalPrompt,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
