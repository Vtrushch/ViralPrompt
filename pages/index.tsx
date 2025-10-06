// pages/index.tsx
import Head from "next/head";
import { useMemo, useState } from "react";
import { gtag } from "@/lib/ga";

/** --- simple heuristic viral scoring --- */
function computeViralScore(text: string) {
  const t = text || "";
  const hasHook = /(^|\n)\s*HOOK\s*:|(^|\n)\s*Hook\s*:/i.test(t);
  const hasBeats = /(^|\n)\s*BEATS\s*:|(^|\n)\s*Beats\s*:/i.test(t);
  const hasCTA = /(^|\n)\s*CTA\s*:|(^|\n)\s*Call\s*to\s*Action/i.test(t);
  const hasTags = /(^|\n)\s*HASHTAGS\s*:|#\w+/.test(t);

  const beatsMatch = t.match(/BEATS\s*:\s*([\s\S]*?)(\n[A-Z ]+?:|$)/i);
  const beatsBlock = beatsMatch ? beatsMatch[1] : "";
  const beatsLines = (beatsBlock.match(/^\s*[\-\d\.\)]/gm) || []).length;

  const len = t.length;
  let score = 40;
  if (hasHook) score += 15;
  if (hasBeats) score += 15;
  if (hasCTA) score += 15;
  if (beatsLines >= 4 && beatsLines <= 6) score += 10;
  else if (beatsLines >= 2 && beatsLines <= 8) score += 5;
  if (len > 200 && len < 1200) score += 5;
  if (hasTags) score += 5;

  score = Math.max(0, Math.min(100, score));
  const label = score >= 75 ? "Good" : score >= 60 ? "Decent" : "Needs improvement";

  const tips: string[] = [];
  if (!hasHook) tips.push("Add a clear HOOK at the top.");
  if (!(beatsLines >= 4 && beatsLines <= 6)) tips.push("Use 4–6 short BEATS (one action per line).");
  if (!hasCTA) tips.push("End with a direct CTA.");
  if (len <= 200) tips.push("Add a bit more detail to each beat.");
  if (len >= 1200) tips.push("Make lines tighter to fit 15–45s.");
  if (!hasTags) tips.push("Optionally add 5–10 hashtags.");

  return { score, label, tips };
}

export default function Home() {
  const [mode, setMode] = useState<"products" | "creators">("products");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  const [format, setFormat] = useState("Listicle");
  const [tone, setTone] = useState("Friendly");
  const [duration, setDuration] = useState("15-30s");
  const [withTags, setWithTags] = useState(false);

  const [showPlan, setShowPlan] = useState<null | "starter" | "pro">(null);

  const viral = useMemo(() => (result ? computeViralScore(result) : null), [result]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult("");
    setRemaining(null);

    // GA: почали генерацію
    gtag("generate_click", {
      mode,
      format,
      tone,
      duration,
      withTags,
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt, format, tone, duration, withTags }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402 || data?.overLimit) {
          setError(data?.error || "Free limit reached. Leave your email to get paid plans.");
          // GA: ліміт вичерпано
          gtag("limit_reached", { mode });
          return;
        }
        throw new Error(typeof data === "string" ? data : data?.error);
      }

      setResult(data.result || "");
      if (typeof data.remaining === "number") setRemaining(data.remaining);

      // GA: успішна генерація
      gtag("generate_success", {
        mode,
        length: (data.result || "").length,
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
      // GA: помилка
      gtag("generate_error", {
        mode,
        message: err?.message || "unknown",
      });
    } finally {
      setLoading(false);
    }
  }

  const scrollTo = (id: string) =>
    typeof window !== "undefined" &&
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Head>
        <title>ViralPrompt.ai – AI TikTok & Reels Script Generator (Products & Creators)</title>
        <meta
          name="description"
          content="Generate viral TikTok/Instagram Reels scripts for products AND daily creator ideas. Hooks, BEATS, CTA, hashtags, calendar — all with AI."
        />
        <meta
          name="keywords"
          content="AI TikTok script generator, Instagram Reels AI, video ideas for creators, daily trends, social media AI"
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://viralprompt.ai/" />

        <meta property="og:title" content="ViralPrompt.ai – AI TikTok & Reels Script Generator" />
        <meta property="og:description" content="For products and creators: generate scripts, ideas, hashtags & more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viralprompt.ai" />
        <meta property="og:image" content="https://viralprompt.ai/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ViralPrompt.ai – AI TikTok & Reels Script Generator" />
        <meta name="twitter:description" content="Generate scripts and daily video ideas with AI." />
        <meta name="twitter:image" content="https://viralprompt.ai/og-image.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* BG gradient */}
      <div className="relative min-h-screen bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(93,95,239,.22),transparent_60%)]" />

        {/* Navbar */}
        <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <div className="font-extrabold tracking-tight">ViralPrompt.ai</div>
            <nav className="hidden gap-2 md:flex">
              <button onClick={() => { scrollTo("features"); gtag("nav_click", { to: "features" }); }} className="rounded-xl px-3 py-2 text-body hover:bg-black/5">Features</button>
              <button onClick={() => { scrollTo("pricing"); gtag("nav_click", { to: "pricing" }); }}  className="rounded-xl px-3 py-2 text-body hover:bg-black/5">Pricing</button>
              <button onClick={() => { scrollTo("faq"); gtag("nav_click", { to: "faq" }); }}       className="rounded-xl px-3 py-2 text-body hover:bg-black/5">FAQ</button>
              <button onClick={() => { scrollTo("generator"); gtag("nav_click", { to: "generator" }); }} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-soft hover:shadow-glow">Try for Free</button>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="px-5">
          <div className="mx-auto max-w-5xl py-16 text-center">
            <span className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-body shadow-soft">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              🔥 Trend-aware prompts, refreshed daily
            </span>
            <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight text-title md:text-6xl">
              Generate <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">viral</span> TikTok &amp; Reels scripts
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-body">
              For products and personal channels. Trend-aware prompts refreshed daily so you never run out of ideas.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => { scrollTo("generator"); gtag("hero_cta", { to: "generator" }); }}
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-soft hover:shadow-glow"
              >
                Try it now
              </button>
              <button
                onClick={() => { scrollTo("features"); gtag("hero_cta", { to: "features" }); }}
                className="rounded-xl border-2 border-primary px-5 py-3 font-semibold text-primary hover:bg-primary/10"
              >
                See features
              </button>
            </div>
            <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 opacity-70">
              <Badge text="No login required" />
              <Badge text="Free plan included" />
              <Badge text="Export to TikTok/IG" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-5 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-title md:text-4xl">Everything you need to post daily</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-body">
              Scripts for products, ideas for creators, hashtags & calendar — stay consistent without burnout.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ["Daily trend focus", "Fresh, trend-aware prompts every day to keep ideas timely."],
                ["Hooks that grab attention", "10+ hooks per idea, optimized for watch time."],
                ["Proven formats", "Listicle, tutorial, POV, myth-busting, storytime."],
                ["Brand voice", "Keep tone consistent across every script."],
                ["30-day calendar", "Daily prompts for a month of content."],
                ["One-click export", "Copy Markdown or plain text anywhere."],
              ].map(([title, desc], i) => (
                <Card key={i} title={title} desc={desc as string} />
              ))}
            </div>
          </div>
        </section>

        {/* Generator */}
        <section id="generator" className="px-5 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-soft backdrop-blur">
              <div className="mb-2 text-lg font-semibold text-title">Generator</div>

              {/* Mode switch */}
              <div className="mb-2 inline-flex rounded-xl border border-black/10 bg-white/70 p-1">
                <button
                  type="button"
                  onClick={() => { setMode("products"); gtag("mode_switch", { mode: "products" }); }}
                  className={`px-3 py-1 rounded-lg text-sm ${mode==="products"?"bg-primary text-white":"text-title hover:bg-black/5"}`}
                >
                  🛍️ Products
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("creators"); gtag("mode_switch", { mode: "creators" }); }}
                  className={`px-3 py-1 rounded-lg text-sm ${mode==="creators"?"bg-primary text-white":"text-title hover:bg-black/5"}`}
                >
                  🎥 Creators
                </button>
              </div>

              {/* Microcopy per mode */}
              <div className="mb-3 text-xs text-body">
                {mode === "products"
                  ? "Trend-aware script builder for products. Hooks/Beats/CTA tuned for watch-time."
                  : "Daily ideas & trend-aware prompts for personal channels. Ask for 5 ideas or a short script."}
              </div>

              <form onSubmit={onSubmit} className="grid gap-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  placeholder={
                    mode === "products"
                      ? "e.g., Product: smart bottle; Audience: gym goers; Tone: energetic; CTA: Grab yours today"
                      : "e.g., Niche: fitness vlogs; Style: humorous; Goal: daily ideas; Ask: 5 trending video ideas or a short script"
                  }
                  className="min-h-[140px] w-full resize-vertical rounded-xl border border-black/10 bg-white/70 p-3 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40"
                />

                <div className="grid gap-2 md:grid-cols-3">
                  <select value={format} onChange={(e)=>setFormat(e.target.value)} className="rounded-xl border border-black/10 p-2">
                    {["Listicle","Tutorial","POV","Myth-busting","Storytime"].map(f => <option key={f}>{f}</option>)}
                  </select>
                  <select value={tone} onChange={(e)=>setTone(e.target.value)} className="rounded-xl border border-black/10 p-2">
                    {["Friendly","Authoritative","Funny","Inspirational"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select value={duration} onChange={(e)=>setDuration(e.target.value)} className="rounded-xl border border-black/10 p-2">
                    {["15-30s","30-45s","45-60s"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <label className="mt-1 inline-flex items-center gap-2 text-sm text-body">
                  <input type="checkbox" checked={withTags} onChange={(e)=>setWithTags(e.target.checked)} />
                  Include hashtags
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-soft hover:shadow-glow disabled:opacity-70"
                >
                  {loading ? "Generating..." : "Generate"}
                </button>

                {typeof remaining === "number" && (
                  <div className="text-xs text-body">Remaining this month: {remaining}</div>
                )}
              </form>

              {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

              {result && (
                <>
                  {viral && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-black/10 bg-white p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          viral.label === "Good"
                            ? "bg-green-100 text-green-700"
                            : viral.label === "Decent"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {viral.label}
                        </span>
                        <span className="text-title font-semibold">Viral Score:</span>
                        <span className="tabular-nums">{viral.score}/100</span>
                      </div>
                      <button
                        onClick={() => {
                          alert(viral.tips.join("\n"));
                          gtag("viral_tips_open", { mode, score: viral.score });
                        }}
                        className="rounded-lg border border-black/10 px-2 py-1 hover:bg-black/5"
                        title="Show quick tips"
                      >
                        Tips
                      </button>
                    </div>
                  )}

                  <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-black/10 bg-gray-50 p-3 text-sm">
                    {result}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      gtag("copy_script", { mode, length: result.length });
                    }}
                    className="mt-2 rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-black/5"
                  >
                    Copy to clipboard
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Content Calendar Preview (Free) */}
        <section id="calendar" className="px-5 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-soft">
              <div className="mb-2 text-lg font-semibold text-title">Content Calendar (Preview)</div>
              <p className="text-sm text-body mb-4">
                Free plan includes just 1 day preview. Upgrade to Starter/Pro for full 30-day calendar.
              </p>

              <div className="rounded-xl border border-black/10 bg-gray-50 p-4">
                <div className="text-sm font-semibold text-title">Day 1</div>
                <div className="text-body text-sm">
                  🎥 Hook idea: “3 mistakes everyone makes with morning coffee”
                  <br />
                  🎯 CTA: “Follow for more coffee hacks”
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { scrollTo("pricing"); gtag("calendar_unlock_cta"); }}
                  className="rounded-xl border-2 border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  Unlock full 30-day calendar →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-5 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-title md:text-4xl">Simple pricing</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-body">Start free. Upgrade when you’re ready.</p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Price
                name="Free"
                price="$0"
                tagline="Test the quality"
                features={["20 generations / mo", "Core formats", "Copy to clipboard", "Viral Score (preview)", "Calendar (1 day preview)", "Both modes: Products & Creators"]}
                cta="Try Free"
                onClick={() => { scrollTo("generator"); gtag("pricing_cta", { plan: "free" }); }}
              />

              <div>
                <Price
                  name="Starter"
                  price="$9/mo"
                  highlight
                  tagline="For solo creators"
                  features={["300 generations / mo", "All formats + hashtags", "30-day calendar", "Email support", "Full Viral Score + tips", "Both modes: Products & Creators"]}
                  cta="Notify me"
                  onClick={() => { setShowPlan("starter"); gtag("pricing_cta", { plan: "starter" }); }}
                />
                <p className="mt-2 text-center text-xs text-body opacity-70">
                  Coming soon — leave your email to get details first.
                </p>
              </div>

              <div>
                <Price
                  name="Pro"
                  price="$29/mo"
                  tagline="For agencies"
                  features={["Unlimited generations", "Team seats (up to 5)", "Brand voice profiles", "Priority support", "Full Viral Score + A/B", "Both modes: Products & Creators"]}
                  cta="Notify me"
                  onClick={() => { setShowPlan("pro"); gtag("pricing_cta", { plan: "pro" }); }}
                />
                <p className="mt-2 text-center text-xs text-body opacity-70">
                  Coming soon — leave your email to get details first.
                </p>
              </div>
            </div>

            {showPlan && (
              <div className="mx-auto mt-6 max-w-md rounded-2xl border border-black/10 bg-white p-4 shadow-soft">
                <div className="mb-2 text-lg font-semibold text-title">
                  {showPlan === "starter" ? "Get early access to Starter" : "Get early access to Pro"}
                </div>
                {/* <SubscribeInline plan={showPlan} onDone={() => setShowPlan(null)} /> */}
                <p className="text-sm text-body">Email form coming here (subscribe component).</p>
                <button
                  onClick={() => { setShowPlan(null); gtag("notify_close", { plan: showPlan }); }}
                  className="mt-2 text-sm text-body hover:text-title"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-title md:text-4xl">FAQ</h2>
            <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white/70">
              {[
                ["Do you track TikTok/IG trends in real time?", "We generate trend-aware prompts daily using proven short-form patterns (hooks, beats, CTAs). While we don’t tap private platform data, we keep ideas fresh and aligned with what works in short video."],
                ["Do I need to record videos myself?", "Yes. We generate scripts and ideas; you record with your phone/editor."],
                ["Can I try it for free?", "Yep — the Free plan includes 20 generations/month."],
                ["Who is it for?", "Creators, small businesses, and agencies who want consistent short-form content."],
                ["Can I cancel anytime?", "Yes, month-to-month billing. Cancel in one click."],
              ].map(([q, a], i) => (
                <details key={i} className="group open:bg-white/90">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold text-title">
                    {q}
                    <span className="text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-body">{a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SEO text block */}
        <section className="px-5 pb-16">
          <div className="mx-auto max-w-4xl text-sm leading-6 text-body">
            <h3 className="mb-2 text-base font-semibold text-title">Why ViralPrompt.ai?</h3>
            <p className="mb-2">
              ViralPrompt.ai is an <strong>AI TikTok script generator</strong> for products AND creators. Describe
              your offer or niche and get hooks, structure, and CTA optimized for retention and discovery.
            </p>
            <p className="mb-2">
              ViralPrompt.ai refreshes prompts daily to stay trend-aware. We don’t promise algorithm magic — we apply
              proven short-form patterns so your ideas feel like “today,” not yesterday.
            </p>
            <p className="mb-2">
              Get ready-to-use <strong>Instagram Reels content ideas</strong>, hashtag suggestions, and export-ready
              scripts (Markdown or plain text). Stay consistent without creative burnout.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-black/5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-body md:flex-row">
            <div className="font-semibold text-title">ViralPrompt.ai</div>
            <div className="flex flex-wrap items-center gap-4">
              <a onClick={() => gtag("footer_click", { to: "terms" })} className="hover:text-title" href="/terms">Terms</a>
              <a onClick={() => gtag("footer_click", { to: "privacy" })} className="hover:text-title" href="/privacy">Privacy</a>
              <button onClick={() => { scrollTo("pricing"); gtag("footer_click", { to: "pricing" }); }} className="hover:text-title">Pricing</button>
              <button onClick={() => { scrollTo("features"); gtag("footer_click", { to: "features" }); }} className="hover:text-title">Features</button>
              <button onClick={() => { scrollTo("faq"); gtag("footer_click", { to: "faq" }); }} className="hover:text-title">FAQ</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ---------- small UI pieces ---------- */
function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs shadow-soft">{text}</span>
  );
}
function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-soft">
      <div className="mb-1 font-semibold text-title">{title}</div>
      <div className="text-body">{desc}</div>
    </div>
  );
}
function Price({
  name, price, tagline, features, cta, onClick, highlight
}: {
  name: string; price: string; tagline: string; features: string[]; cta: string;
  onClick: () => void; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-soft ${highlight ? "border-primary shadow-glow" : "border-black/10 bg-white/80"}`}>
      <div className="flex items-baseline justify-between">
        <div className="font-extrabold text-title">{name}</div>
        <div className="text-2xl font-extrabold text-title">{price}</div>
      </div>
      <div className="mt-1 text-body">{tagline}</div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-body">
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <button onClick={onClick} className={`mt-4 w-full rounded-xl px-4 py-2 font-semibold ${highlight ? "bg-primary text-white hover:shadow-glow" : "border-2 border-primary text-primary hover:bg-primary/10"}`}>
        {cta}
      </button>
    </div>
  );
}
