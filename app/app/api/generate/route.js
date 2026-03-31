import Replicate from "replicate";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    let prediction = await replicate.predictions.create({
      version: "black-forest-labs/flux-dev",
      input: { prompt },
    });

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await new Promise((r) => setTimeout(r, 2000));
      prediction = await replicate.predictions.get(prediction.id);
    }

    if (prediction.status === "failed") {
      return new Response(JSON.stringify({ error: "Failed" }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ video: prediction.output?.[0] }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
