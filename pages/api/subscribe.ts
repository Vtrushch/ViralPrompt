// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv(); // читає URL/TOKEN з Vercel ENV

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { email, plan = "unknown" } = (req.body || {}) as { email?: string; plan?: string };
    const clean = (email || "").trim().toLowerCase();

    if (!clean || !/^\S+@\S+\.\S+$/.test(clean)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const ts = Date.now();
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";

    // 1) Зберігаємо e-mail у множину
    await redis.sadd("subscribers", clean);
    // 2) Деталі підписника у hash
    await redis.hset(`subscriber:${clean}`, { email: clean, plan, ts, ip });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("subscribe error:", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
