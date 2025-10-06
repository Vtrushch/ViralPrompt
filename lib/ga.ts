// Google Analytics helper functions for ViralPrompt.ai

// ✅ Твій ідентифікатор GA4 — можна замінити або винести в .env
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-G8E4N2BS1V";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

/**
 * Виклик базової функції gtag()
 */
export const gtag = (...args: any[]) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

/**
 * Реєструє перегляд сторінки (pageview)
 */
export const pageview = (url: string) => {
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/**
 * Відправляє подію (event)
 */
export const gaEvent = (action: string, params?: Record<string, any>) => {
  gtag("event", action, params);
};
