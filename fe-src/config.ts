// config.ts
const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
  ? "http://localhost:8080/api"
  : "https://tu-api-produccion.com/api";