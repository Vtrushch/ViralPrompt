import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const prompt = (req.body?.prompt as string) || "";
    if (!prompt) return res.status(400).json({ error: "Empty prompt" });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: "You write concise, high-converting short-form scripts (TikTok/Reels). Return plain text." },
        { role: "user", content: prompt }
      ]
    });

    const text = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ result: text });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
