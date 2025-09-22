import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic SEO */}
        <meta
          name="description"
          content="Generate viral TikTok and Instagram Reels scripts instantly with AI. Hooks, CTAs, and proven formats for creators and brands."
        />
        <meta
          name="keywords"
          content="AI TikTok script generator, Instagram Reels AI, viral content ideas, social media AI tool"
        />

        {/* Open Graph (Facebook/LinkedIn) */}
        <meta property="og:title" content="ViralPrompt.ai – AI TikTok & Reels Script Generator" />
        <meta
          property="og:description"
          content="Create viral short-form scripts in seconds with AI."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viralprompt.ai" />
        <meta property="og:image" content="https://viralprompt.ai/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ViralPrompt.ai – AI TikTok & Reels Script Generator" />
        <meta
          name="twitter:description"
          content="Generate viral TikTok/Reels scripts instantly."
        />
        <meta name="twitter:image" content="https://viralprompt.ai/og-image.png" />

        {/* Schema Markup (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ViralPrompt.ai",
              description: "AI tool to generate viral TikTok & Reels scripts instantly.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: "https://viralprompt.ai",
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
