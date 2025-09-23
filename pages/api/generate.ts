import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { Redis } from "@upstash/redis";

function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const FREE_LIMIT = 20;
const redis = Redis.fromEnv(); // читає UPSTASH_REDIS_REST_URL / TOKEN з ENV

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const prompt = (req.body?.prompt as string) || "";
    // опціонально можеш передавати email з фронту: body: { prompt, email }
    const email = ((req.body?.email as string) || "").trim().toLowerCase();

    if (!prompt) return res.status(400).json({ error: "Empty prompt" });

    // ====== RATE LIMIT (20 / month) ======
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    // якщо є email — рахуємо по ньому, інакше по IP
    const id = email || ip;
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const key = `gen:${id}:${month}`;

    // інкремент і встановлення TTL до початку наступного місяця
    const count = await redis.incr(key);
    if (count === 1) {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const ttl = Math.floor((+nextMonth - +now) / 1000);
      await redis.expire(key, ttl);
    }

    if (count > FREE_LIMIT) {
      return res.status(402).json({
        error: `Free limit reached (${FREE_LIMIT}/month). Leave your email to get Starter/Pro updates.`,
        overLimit: true,
        remaining: 0,
      });
    }
    // ====== /RATE LIMIT ======

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
    return res.status(200).json({
      result: text,
      remaining: Math.max(FREE_LIMIT - count, 0),
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
