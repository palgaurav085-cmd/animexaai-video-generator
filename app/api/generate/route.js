import Replicate from "replicate";

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.create({
      model: "stability-ai/sdxl",  // stable model
      input: {
        prompt: prompt,
      },
    });

    return new Response(
      JSON.stringify({
        video: prediction.urls.get, // temporary output link
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
