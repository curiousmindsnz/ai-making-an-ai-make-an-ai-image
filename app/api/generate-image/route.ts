import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey });

  let response;
  try {
    response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt.trim(),
      n: 1,
      size: "1024x1024",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to call OpenAI API";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) {
    return NextResponse.json(
      { error: "No image was generated" },
      { status: 500 }
    );
  }

  return NextResponse.json({ imageUrl });
}
