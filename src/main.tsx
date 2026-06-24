import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.tsx";
import "./index.css";

inject();


const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("[App] Elemento root não encontrado. Verifique o index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
