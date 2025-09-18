import { useState } from "react";

export default function Home() {
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
        body: JSON.stringify({ prompt })
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

  function scrollToGen() {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main style={{ fontFamily: "Inter, system-ui, Arial, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee", padding: "12px 20px", display: "flex", justifyContent: "space-between" }}>
        <strong>ViralPrompt.ai</strong>
        <a onClick={scrollToGen} style={{ cursor: "pointer", background: "#5D5FEF", color: "#fff", padding: "10px 14px", borderRadius: 10, fontWeight: 600 }}>Try for Free</a>
      </header>

      <section style={{ padding: "64px 20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 40, color: "#2B2D42" }}>Generate viral TikTok/Reels scripts</h1>
        <p style={{ color: "#4B5563" }}>Describe your offer — get a ready script in seconds.</p>
        <button onClick={scrollToGen} style={{ background: "#5D5FEF", color: "#fff", padding: "12px 18px", borderRadius: 12, border: 0, fontWeight: 600, cursor: "pointer" }}>Try for Free</button>
      </section>

      <section id="generator" style={{ padding: "32px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: 20, border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 6px 24px rgba(0,0,0,0.06)" }}>
          <h2 style={{ marginTop: 0 }}>Generator</h2>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Product, audience, angle, CTA…"
              rows={6}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }}
              required
            />
            <button type="submit" disabled={loading} style={{ background: "#5D5FEF", color: "#fff", padding: "12px 18px", border: 0, borderRadius: 12, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>

          {error && <div style={{ marginTop: 12, color: "#b91c1c" }}>{error}</div>}
          {result && <pre style={{ marginTop: 16, whiteSpace: "pre-wrap", background: "#fafafa", padding: 16, borderRadius: 12, border: "1px solid #eee" }}>{result}</pre>}
        </div>
      </section>

      <footer style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>
        © {new Date().getFullYear()} ViralPrompt.ai
      </footer>
    </main>
  );
}
