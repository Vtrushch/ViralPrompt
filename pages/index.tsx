import Head from "next/head";
import { useEffect, useState } from "react";

const ACCENT = "#5D5FEF";
const TITLE = "#2B2D42";
const TEXT = "#4B5563";

export default function Home() {
  // ----- Generator state -----
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

  // ----- Smooth scroll helpers -----
  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // highlight nav on scroll (simple)
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = ["home", "features", "generator", "pricing", "faq"];
    const handler = () => {
      const y = window.scrollY + 120; // header offset
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <main>
      <Head>
        <title>ViralPrompt.ai — Generate viral TikTok/Reels scripts</title>
        <meta name="description" content="AI generator that creates TikTok & Instagram Reels scripts in seconds." />
      </Head>

      {/* Header / Navbar */}
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>ViralPrompt.ai</div>
          <nav style={styles.nav}>
            <a style={navLink(active === "features")} onClick={() => scrollToId("features")}>Features</a>
            <a style={navLink(active === "pricing")} onClick={() => scrollToId("pricing")}>Pricing</a>
            <a style={navLink(active === "faq")} onClick={() => scrollToId("faq")}>FAQ</a>
            <a
              onClick={() => scrollToId("generator")}
              style={ctaSm}
            >
              Try for Free
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" style={{ ...styles.section, paddingTop: 80 }}>
        <div style={styles.container}>
          <h1 style={styles.h1}>Generate viral TikTok/Reels scripts</h1>
          <p style={styles.lead}>
            Describe your offer — get a ready-to-post short-form script in seconds.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={ctaLg} onClick={() => scrollToId("generator")}>Try for Free</button>
            <button style={ghostBtn} onClick={() => scrollToId("features")}>See Features</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Why creators love ViralPrompt.ai</h2>
          <p style={styles.sublead}>Fast ideas, proven hooks, consistent posting.</p>

          <div style={styles.grid3}>
            {[
              { title: "Hooks that grab attention", desc: "Get 10+ scroll-stopping hooks per topic, tailored to your audience and niche." },
              { title: "Formats that convert", desc: "A/B scripts for viral formats: listicle, POV, myth-busting, tutorial, storytime." },
              { title: "Brand voice & CTA", desc: "Keep your tone consistent and always finish with a strong call-to-action." },
              { title: "Content calendar", desc: "Daily prompts for 30 days to keep you consistent and stress-free." },
              { title: "SEO keywords", desc: "Get suggested hashtags and keywords to improve discovery and reach." },
              { title: "Export anywhere", desc: "Copy as plain text or Markdown and paste into TikTok/IG/YouTube Shorts." },
            ].map((f, i) => (
              <div key={i} style={styles.card}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: TITLE }}>{f.title}</div>
                <div style={{ color: TEXT }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section id="generator" style={styles.section}>
        <div style={{ ...styles.container, maxWidth: 900 }}>
          <div style={styles.panel}>
            <h3 style={{ margin: 0, color: TITLE }}>Generator</h3>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, marginTop: 12 }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Grow subscriptions for a coffee subscription box. Target: busy professionals. Tone: friendly. CTA: Get your first box."
                rows={6}
                style={styles.textarea}
                required
              />
              <button type="submit" disabled={loading} style={ctaBlock}>
                {loading ? "Generating..." : "Generate"}
              </button>
            </form>

            {error && <div style={{ marginTop: 12, color: "#b91c1c" }}>{error}</div>}
            {result && (
              <pre style={styles.resultBox}>{result}</pre>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Simple pricing</h2>
          <p style={styles.sublead}>Start free. Upgrade when you’re ready to scale.</p>

          <div style={styles.grid3}>
            <PricingCard
              name="Free"
              price="$0"
              tagline="Test the generator"
              features={[
                "20 generations / month",
                "Basic hooks & scripts",
                "Copy to clipboard",
              ]}
              ctaLabel="Try Free"
              ctaOnClick={() => scrollToId("generator")}
              highlighted={false}
            />
            <PricingCard
              name="Starter"
              price="$9/mo"
              tagline="For solo creators"
              features={[
                "300 generations / month",
                "All formats + hashtags",
                "Content calendar (30 days)",
                "Email support",
              ]}
              ctaLabel="Choose Starter"
              ctaOnClick={() => scrollToId("generator")} // заміни на /checkout пізніше
              highlighted={true}
            />
            <PricingCard
              name="Pro"
              price="$29/mo"
              tagline="For agencies & teams"
              features={[
                "Unlimited generations",
                "Team seats (up to 5)",
                "Brand voice profiles",
                "Priority support",
              ]}
              ctaLabel="Choose Pro"
              ctaOnClick={() => scrollToId("generator")}
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={styles.section}>
        <div style={{ ...styles.container, maxWidth: 900 }}>
          <h2 style={styles.h2}>FAQ</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              {
                q: "Do I need to record videos myself?",
                a: "Yes, ViralPrompt.ai generates high-performing scripts and ideas. You record the video using your phone or editor of choice."
              },
              {
                q: "Can I try it for free?",
                a: "Absolutely. The Free plan gives you 20 generations per month to test quality and fit."
              },
              {
                q: "Who is ViralPrompt.ai for?",
                a: "Creators, small businesses, and agencies who want consistent short-form content without creative burnout."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Plans are month-to-month and you can cancel with one click from your account page."
              }
            ].map(({ q, a }, i) => <FaqItem key={i} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={{ fontWeight: 700 }}>ViralPrompt.ai</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: TEXT }}>
            <a style={link} onClick={() => scrollToId("pricing")}>Pricing</a>
            <a style={link} onClick={() => scrollToId("features")}>Features</a>
            <a style={link} onClick={() => scrollToId("faq")}>FAQ</a>
            <a style={link} href="/terms">Terms</a>
            <a style={link} href="/privacy">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        html, body, main { margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        a { text-decoration: none; }
        button { cursor: pointer; }
      `}</style>
    </main>
  );
}

/* -------- Small components -------- */

function PricingCard(props: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaOnClick: () => void;
  highlighted?: boolean;
}) {
  const { name, price, tagline, features, ctaLabel, ctaOnClick, highlighted } = props;
  return (
    <div style={{ ...styles.card, border: highlighted ? `2px solid ${ACCENT}` : "1px solid #e5e7eb", boxShadow: highlighted ? "0 10px 30px rgba(93,95,239,.25)" : styles.card.boxShadow }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontWeight: 800, color: TITLE }}>{name}</div>
        <div style={{ fontWeight: 800, color: TITLE, fontSize: 22 }}>{price}</div>
      </div>
      <div style={{ color: TEXT, marginTop: 6 }}>{tagline}</div>
      <ul style={{ marginTop: 12, paddingLeft: 18, color: TEXT }}>
        {features.map((f, i) => <li key={i} style={{ margin: "6px 0" }}>{f}</li>)}
      </ul>
      <button onClick={ctaOnClick} style={highlighted ? ctaBlock : ghostBlock}>{ctaLabel}</button>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles.faqItem}>
      <button onClick={() => setOpen(!open)} style={styles.faqBtn}>
        <span>{q}</span>
        <span>{open ? "–" : "+"}</span>
      </button>
      {open && <div style={{ color: TEXT, padding: "0 4px 8px 4px" }}>{a}</div>}
    </div>
  );
}

/* -------- Styles -------- */

const styles: Record<string, any> = {
  header: {
    position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee",
    zIndex: 20
  },
  container: {
    width: "100%", maxWidth: 1120, margin: "0 auto", padding: "12px 20px",
  },
  nav: {
    display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"
  },
  section: {
    padding: "56px 20px",
  },
  h1: {
    margin: 0, textAlign: "center", fontSize: 48, color: TITLE, lineHeight: 1.1
  },
  lead: {
    textAlign: "center", color: TEXT, marginTop: 12, fontSize: 18
  },
  h2: {
    margin: 0, textAlign: "center", fontSize: 34, color: TITLE
  },
  sublead: {
    textAlign: "center", color: TEXT, marginTop: 8
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginTop: 20
  },
  card: {
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
    background: "#fff",
  },
  panel: {
    padding: 20,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    fontFamily: "inherit"
  },
  resultBox: {
    marginTop: 16,
    whiteSpace: "pre-wrap",
    background: "#fafafa",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #eee",
  },
  faqItem: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
  },
  faqBtn: {
    width: "100%",
    textAlign: "left" as const,
    background: "transparent",
    border: 0,
    padding: "12px 10px",
    fontWeight: 600,
    color: TITLE,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer"
  },
  footer: {
    borderTop: "1px solid #eee",
    padding: "20px 0",
    color: TEXT
  }
};

/* -------- Reusable buttons/links -------- */

function navLink(active = false): React.CSSProperties {
  return {
    padding: "8px 10px",
    borderRadius: 10,
    color: active ? "#111" : TEXT,
    background: active ? "rgba(93,95,239,0.10)" : "transparent",
    cursor: "pointer" as const
  };
}

const ctaLg: React.CSSProperties = {
  background: ACCENT,
  color: "#fff",
  padding: "12px 18px",
  border: "0",
  borderRadius: 12,
  fontWeight: 700
};

const ctaSm: React.CSSProperties = {
  ...ctaLg,
  padding: "10px 14px",
  fontWeight: 700
};

const ctaBlock: React.CSSProperties = {
  ...ctaLg,
  width: "100%",
  textAlign: "center" as const
};

const ghostBtn: React.CSSProperties = {
  background: "transparent",
  color: ACCENT,
  border: `2px solid ${ACCENT}`,
  padding: "10px 16px",
  borderRadius: 12,
  fontWeight: 700
};

const ghostBlock: React.CSSProperties = {
  ...ghostBtn,
  width: "100%"
};

const link: React.CSSProperties = { color: TEXT, cursor: "pointer" };
