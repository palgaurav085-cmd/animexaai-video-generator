import { NextResponse } from "next/server";

export async function POST(req) {
  const form = await req.formData();
  const script = form.get("script");
  const character = form.get("character");

  return NextResponse.json({
    success: true,
    message: "Your script & character uploaded successfully. AI video generation engine will be integrated here."
  });
}
