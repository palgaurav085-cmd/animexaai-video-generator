export const runtime = "edge";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

    const resp = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: "Token " + REPLICATE_API_TOKEN }
    });

    const data = await resp.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    let videoUrl = null;

    if (data.status === "succeeded" && data.output) {
      if (typeof data.output === "string") videoUrl = data.output;
      if (Array.isArray(data.output)) videoUrl = data.output.find(o => typeof o === "string" && o.endsWith(".mp4"));
      if (typeof data.output === "object") videoUrl = data.output.video;
    }

    return new Response(JSON.stringify({
      id: data.id,
      status: data.status,
      video_url: videoUrl
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
