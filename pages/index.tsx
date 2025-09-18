import Head from "next/head";
import { useState } from "react";

export default function Home() {
  // generator state
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.result || "");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Head>
        <title>ViralPrompt.ai — Viral TikTok/Reels scripts</title>
        <meta name="description" content="AI that generates high-converting short-form scripts in seconds." />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>

      {/* BG gradient */}
      <div className="relative min-h-screen bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(93,95,239,.22),transparent_60%)]" />

        {/* Navbar */}
        <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <div className="font-extrabold tracking-tight">ViralPrompt.ai</div>
            <nav className="hidden gap-2 md:flex">
              <button onClick={() => scrollTo("features")} className="rounded-xl px-3 py-2 text-body hover:bg-black/5">Features</button>
              <button onClick={() => scrollTo("pricing")}  className="rounded-xl px-3 py-2 text-body hover:bg-black/5">Pricing</button>
              <button onClick={() => scrollTo("faq")}       className="rounded-xl px-3 py-2 text-body hover:bg-black/5">FAQ</button>
              <button onClick={() => scrollTo("generator")} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-soft hover:shadow-glow">Try for Free</button>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="px-5">
          <div className="mx-auto max-w-5xl py-16 text-center">
            <span className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-body shadow-soft">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              New: Script formats for listicle • myth-busting • tutorial
            </span>
            <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight text-title md:text-6xl">
              Generate <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">viral</span> TikTok & Reels scripts
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-body">
              Describe your offer. Get hooks, structure, and CTA ready to post in seconds.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => scrollTo("generator")} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-soft hover:shadow-glow">
                Try it now
              </button>
              <button onClick={() => scrollTo("features")} className="rounded-xl border-2 border-primary px-5 py-3 font-semibold text-primary hover:bg-primary/10">
                See features
              </button>
            </div>
            {/* little trust row */}
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
            <p className="mx-auto mt-2 max-w-2xl text-center text-body">From scroll-stopping hooks to clear CTAs — stay consistent without creative burnout.</p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ["Hooks that grab attention", "10+ hooks per idea, optimized for watch time."],
                ["Proven formats", "Listicle, tutorial, POV, myth-busting, storytime."],
                ["Brand voice", "Keep tone consistent across every script."],
                ["SEO & hashtags", "Suggested keywords and tags for discovery."],
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
              <form onSubmit={onSubmit} className="grid gap-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  placeholder="e.g., Grow subscriptions for a coffee box. Target: busy professionals. Tone: friendly. CTA: Get your first box."
                  className="min-h-[140px] w-full resize-vertical rounded-xl border border-black/10 bg-white/70 p-3 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-soft hover:shadow-glow disabled:opacity-70"
                >
                  {loading ? "Generating..." : "Generate"}
                </button>
              </form>

              {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
              {result && (
                <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-black/10 bg-gray-50 p-3 text-sm">
                  {result}
                </pre>
              )}
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
                features={["20 generations / mo", "Core formats", "Copy to clipboard"]}
                cta="Try Free"
                onClick={() => scrollTo("generator")}
              />
              <Price
                name="Starter"
                price="$9/mo"
                highlight
                tagline="For solo creators"
                features={["300 generations / mo", "All formats + hashtags", "30-day calendar", "Email support"]}
                cta="Choose Starter"
                onClick={() => scrollTo("generator")}
              />
              <Price
                name="Pro"
                price="$29/mo"
                tagline="For agencies"
                features={["Unlimited generations", "Team seats (up to 5)", "Brand voice profiles", "Priority support"]}
                cta="Choose Pro"
                onClick={() => scrollTo("generator")}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-title md:text-4xl">FAQ</h2>
            <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white/70">
              {[
                ["Do I need to record videos myself?", "Yes. We generate scripts/ideas; you record with your phone/editor."],
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

        {/* Footer */}
        <footer className="border-t border-black/5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-body md:flex-row">
            <div className="font-semibold text-title">ViralPrompt.ai</div>
            <div className="flex flex-wrap items-center gap-4">
              <a className="hover:text-title" href="/terms">Terms</a>
              <a className="hover:text-title" href="/privacy">Privacy</a>
              <button onClick={() => scrollTo("pricing")} className="hover:text-title">Pricing</button>
              <button onClick={() => scrollTo("features")} className="hover:text-title">Features</button>
              <button onClick={() => scrollTo("faq")} className="hover:text-title">FAQ</button>
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
