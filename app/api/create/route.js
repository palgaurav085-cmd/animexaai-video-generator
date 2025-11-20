// /app/api/create/route.js
export const runtime = "edge";

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body.prompt;
    const scenes = Array.isArray(body.scenes) ? body.scenes : [prompt];
    const finalPrompt = scenes.join(", ");

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || (global?.REPLICATE_API_TOKEN);

    if (!REPLICATE_API_TOKEN) {
      return new Response(JSON.stringify({ error: "Missing REPLICATE_API_TOKEN" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Use the verified Flux model version hash (replace if newer)
    const modelVersion = "7f706cb4227e314b43b464f50a0c86bb1a8f7bd94b2074fa3437ea0c8d575f7c";

    const createResp = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + REPLICATE_API_TOKEN
      },
      body: JSON.stringify({
        version: modelVersion,
        input: {
          prompt: finalPrompt,
          fps: 24,
          num_frames: 96,
          resolution: "1280x720"
        }
      })
    });

    // If Replicate returns an HTML page (bad version / bad auth), forward useful info
    const contentType = createResp.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!isJson) {
      const text = await createResp.text();
      return new Response(JSON.stringify({ error: "Non-JSON response from Replicate", body_preview: text.slice(0, 1000) }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await createResp.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Return prediction id to frontend immediately
    return new Response(JSON.stringify({
      success: true,
      id: data.id,
      status: data.status || "starting"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
