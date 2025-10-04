// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const SYSTEM_PROMPTS = {
  products: `
You are an expert in short-form product marketing for TikTok/IG Reels.
You produce trend-aware scripts using proven patterns (hooks, tight beats, direct CTAs) refined daily.

Return plain text with:
HOOK:
BEATS: 4–6 short, shootable beats (one line each).
CTA:
(If requested) HASHTAGS: 5–10 relevant tags.

Constraints:
- 15–45s runtime.
- Punchy, concrete, high-retention language.
- Focus on watch-time and conversion.
  `,
  creators: `
You are an expert content ideator for creators on TikTok/IG Reels.
You produce trend-aware prompts and scripts refined daily by proven short-form patterns.

Depending on the ask, return EITHER:
A) a personal video script (HOOK / BEATS / CTA), OR
B) a list of 5 fresh video IDEAS with micro-prompts.

(If requested) HASHTAGS: 5–10 relevant tags.
Keep it 15–45s, authentic, and optimized for retention.
  `,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const {
      prompt = "",
      mode = "products",
      format,
      tone,
      duration,
      withTags,
    } = (req.body || {}) as {
      prompt: string;
      mode?: "products" | "creators";
      format?: string;
      tone?: string;
      duration?: string;
      withTags?: boolean;
    };

    if (!prompt.trim()) return res.status(400).json({ error: "Empty prompt" });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const sys = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.products;

    const userMsg = [
      `MODE: ${mode}`,
      format ? `FORMAT: ${format}` : "",
      tone ? `TONE: ${tone}` : "",
      duration ? `DURATION: ${duration}` : "",
      withTags ? `INCLUDE HASHTAGS` : "",
      `USER PROMPT: ${prompt}`,
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: userMsg },
      ],
    });

    const text = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ result: text });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
