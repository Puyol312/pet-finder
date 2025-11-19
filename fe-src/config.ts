// config.ts
const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
  ? "http://localhost:8080"
  : "https://pet-finder-prod.up.railway.app";
