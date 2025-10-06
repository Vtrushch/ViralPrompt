// lib/ga.ts
export const GA_ID = "G-G8E4N2BS1V";

// generic event
export function gtag(
  action: string,
  params: Record<string, any> = {}
) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, params);
  }
}

// page_view (викликаємо в _app.tsx)
export function pageview(url: string) {
  gtag("page_view", { page_path: url });
}
