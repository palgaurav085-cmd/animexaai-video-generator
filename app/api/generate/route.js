import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "e23d4c7d93085db8...", // ← model ID (next step me duunga)
        input: {
          prompt: prompt
        }
      })
    });

    const prediction = await response.json();

    return NextResponse.json({ prediction }, { status: 200 });

  } catch (error) {
    console.log("API ERROR:", error);
    return NextResponse.json({ error: "Failed to generate video" }, { status: 500 });
  }
}
