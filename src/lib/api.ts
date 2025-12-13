export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://keycv.onrender.com";

export const buildApiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
