import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ----- Favicon & Icons ----- */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#5D5FEF" />

        {/* ----- Basic SEO (title ставимо у сторінках через <Head>) ----- */}
        <meta
          name="description"
          content="Generate viral TikTok and Instagram Reels scripts instantly with AI. Hooks, CTAs, and proven formats for creators and brands."
        />
        <meta
          name="keywords"
          content="AI TikTok script generator, Instagram Reels AI, viral content ideas, social media AI tool"
        />
        <meta name="robots" content="index,follow" />

        {/* ----- Open Graph ----- */}
        <meta property="og:site_name" content="ViralPrompt.ai" />
        <meta property="og:title" content="ViralPrompt.ai – AI TikTok & Reels Script Generator" />
        <meta property="og:description" content="Create viral short-form scripts in seconds with AI." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viralprompt.ai" />
        <meta property="og:image" content="https://viralprompt.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Якщо створиш Facebook App, додай нижче: */}
        {/* <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" /> */}

        {/* ----- Twitter Card ----- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ViralPrompt.ai – AI TikTok & Reels Script Generator" />
        <meta name="twitter:description" content="Generate viral TikTok/Reels scripts instantly." />
        <meta name="twitter:image" content="https://viralprompt.ai/og-image.png" />
        {/* Якщо є твій @username у Х (Twitter), додай: */}
        {/* <meta name="twitter:site" content="@yourhandle" /> */}

        {/* ----- JSON-LD (Schema.org) ----- */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ViralPrompt.ai",
              url: "https://viralprompt.ai",
              description:
                "AI tool to generate viral TikTok & Reels scripts instantly.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: { "@type": "Organization", name: "ViralPrompt.ai" },
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
