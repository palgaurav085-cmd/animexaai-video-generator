import Replicate from "replicate";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b0b6d5e9f1d6c5d8cfae5b6f9e9f2c9c9b0e9b7e8c8d9f1a2",
      {
        input: { prompt },
      }
    );

    return new Response(
      JSON.stringify({ video: output[0] }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
