// Base URL for backend API calls.
// Empty = same origin (works with the Vite dev proxy and same-origin deployments).
// Set VITE_API_URL at build time when the backend is hosted on a different origin.
export const API_BASE = import.meta.env.VITE_API_URL || "";
