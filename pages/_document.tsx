// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="canonical" href="https://viralprompt.ai/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viralprompt.ai" />
        <meta property="og:image" content="https://viralprompt.ai/og-image.png" />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ViralPrompt.ai",
              description:
                "AI generator for TikTok/Reels: product scripts and creator video ideas.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: "https://viralprompt.ai",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              featureList: [
                "Product marketing scripts",
                "Creator daily video ideas",
                "Trend-aware prompts (refreshed daily)",
                "Viral Score",
                "30-day content calendar",
              ],
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
