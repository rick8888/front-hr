import Echo from "laravel-echo";
import apiClient from "./api.js";

export function createChatRealtime() {
  const key = import.meta.env.VITE_REVERB_APP_KEY;
  if (!key) {
    throw new Error("VITE_REVERB_APP_KEY is not configured.");
  }

  const apiBaseUrl = apiClient.defaults.baseURL.replace(/\/api\/v1\/?$/, "");
  const token = localStorage.getItem("token");

  return new Echo({
    broadcaster: "reverb",
    key,
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || "http") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${apiBaseUrl}/broadcasting/auth`,
    auth: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
}
