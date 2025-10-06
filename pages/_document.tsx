// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const siteUrl = "https://viralprompt.ai";
  const ogImage = `${siteUrl}/og-image.png`;

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ViralPrompt.ai",
    description:
      "AI generator for TikTok/Reels: product scripts and creator video ideas. Trend-aware prompts refreshed daily.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Product marketing scripts",
      "Creator daily video ideas",
      "Trend-aware prompts (refreshed daily)",
      "Viral Score",
      "30-day content calendar",
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ViralPrompt.ai",
    url: siteUrl,
    logo: `${siteUrl}/favicon-192.png`,
    sameAs: [
      // add when ready:
      // "https://www.tiktok.com/@yourhandle",
      // "https://www.instagram.com/yourhandle",
      // "https://www.youtube.com/@yourhandle"
    ],
  };

  return (
    <Html lang="en">
      <Head>
        {/* Canonical & robots */}
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="theme-color" content="#5D5FEF" />

        {/* Favicons / PWA basics (place files in /public) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}

        {/* OG/Twitter baseline (page-specific tags can override in pages via <Head>) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />

        {/* Performance hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G8E4N2BS1V"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-G8E4N2BS1V', { page_path: window.location.pathname });
            `,
          }}
        />

        {/* JSON-LD: SoftwareApplication */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
