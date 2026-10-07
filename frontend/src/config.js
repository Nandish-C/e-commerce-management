// Base URL for backend API calls.
// - Local dev (npm run dev): empty → Vite proxies /api to the local backend (localhost:5000)
// - Production build: deployed backend URL (override anytime by setting VITE_API_URL at build time)
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://e-commerce-management-ztij-cyan.vercel.app"
    : "");
