import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.tsx";
import "./index.css";

inject();

if (import.meta.env.DEV) {
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("[App] Elemento root não encontrado. Verifique o index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
