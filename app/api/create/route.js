export const runtime = "edge";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return Response.json({ error: "Missing REPLICATE_API_TOKEN" }, { status: 500 });
    }

    // ⭐ PUBLIC, FREE, WORKING MODEL VERSION (Stable Video Diffusion)
    const version =
      "c2e749ecc630bb1e3ceaa8a6cec1e8152ef749398a422a2f51ac9e8d5f87b6e1";

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
          motion_bucket_id: 127,
          fps: 6,
          augmentation_level: 0.5,
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
    return Response.json({ error: err.message }, { status: 500 });
  }
}
