import Replicate from "replicate";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing prediction ID" }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(id);

    return Response.json(prediction, { status: 200 });

  } catch (err) {
    return Response.json(
      { error: "Status API Error", raw: err.message },
      { status: 500 }
    );
  }
}
