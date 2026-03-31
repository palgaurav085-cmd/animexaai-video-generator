import Replicate from "replicate";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "black-forest-labs/flux-dev",
      {
        input: { prompt },
      }
    );

    return new Response(
      JSON.stringify({ video: output?.[0] }),
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
