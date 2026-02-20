import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error handling para produção
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(<App />);
} else {
  console.error('Root element not found');
}
