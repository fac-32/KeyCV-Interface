const DEFAULT_API_BASE_URL = "https://keycv.onrender.com";
// For local dev use LOCAL_API_BASE_URL
// const LOCAL_API_BASE_URL = "http://localhost:3000";
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    "",
  ) || DEFAULT_API_BASE_URL;

export const buildApiUrl = (path: string) =>
  `${DEFAULT_API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
