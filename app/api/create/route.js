export const runtime = "edge";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return Response.json(
        { error: "Missing REPLICATE_API_TOKEN" },
        { status: 500 }
      );
    }

    // ⭐ NEW — Correct API call for Flux Video
    const createPrediction = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
        body: JSON.stringify({
          version: "7f706cb4227e314b43b464f50a0c86bb1a8f7bd94b2074fa3437ea0c8d575f7c",
          input: {
            prompt: prompt,
            fps: 24,
            num_frames: 96,
            resolution: "1280x720",
            aspect_ratio: "16:9"
          }
        }),
      }
    );

    const data = await createPrediction.json();

    // ⭐ Handling errors
    if (data?.error) {
      return Response.json(
        { error: "Replicate API Error: " + JSON.stringify(data.error) },
        { status: 500 }
      );
    }

    // ⭐ MUST HAVE — Prediction ID required
    if (!data.id) {
      return Response.json(
        { error: "Replicate did not return prediction id" },
        { status: 500 }
      );
    }

    // SUCCESS
    return Response.json({
      id: data.id,
      status: data.status
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
