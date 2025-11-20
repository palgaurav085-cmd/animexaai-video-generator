export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing prediction ID" }, { status: 400 });
    }

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!REPLICATE_API_TOKEN) {
      return Response.json(
        { error: "Missing REPLICATE_API_TOKEN" },
        { status: 500 }
      );
    }

    // Fetch status from Replicate
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    // If completed, return the video URL
    if (result.status === "succeeded") {
      return Response.json({
        status: "succeeded",
        video_url: result.output?.video || null,
        full_output: result.output || null,
      });
    }

    // Still processing
    return Response.json({
      status: result.status,
      output: result.output || null,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
