export const runtime = "edge";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return Response.json(
        { error: "Missing REPLICATE_API_TOKEN" },
        { status: 500 }
      );
    }

    // 👇 Correct model version for Flux Video
    const version =
      "8093e1fc5c3c4fb2ba23e0878287f337607ec650f1151e81bcf08df07b0be4fc";

    // 1️⃣ Create prediction
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version,
        input: {
          prompt,
          fps: 24,
          num_frames: 96,
        },
      }),
    });

    const prediction = await createRes.json();

    if (!prediction.id) {
      return Response.json(
        { error: "Replicate did not return prediction id", raw: prediction },
        { status: 500 }
      );
    }

    return Response.json({ id: prediction.id });
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
