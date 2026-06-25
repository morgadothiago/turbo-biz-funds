import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.tsx";
import "./index.css";

inject();

// Auto-reload on chunk load failure caused by new deploys
window.addEventListener("unhandledrejection", (event) => {
  const msg = event.reason?.message ?? "";
  if (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("error loading dynamically imported module")
  ) {
    const lastReload = parseInt(sessionStorage.getItem("chunk_reload_ts") || "0");
    if (Date.now() - lastReload > 8000) {
      sessionStorage.setItem("chunk_reload_ts", Date.now().toString());
      window.location.reload();
    }
  }
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("[App] Elemento root não encontrado. Verifique o index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
