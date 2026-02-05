import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false, // Faster builds
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/")) {
            return "react-core";
          }
          // React Router
          if (id.includes("node_modules/react-router") ||
              id.includes("node_modules/@remix-run/")) {
            return "router";
          }
          // Recharts - commented out to avoid initialization order issues
          // The d3/recharts libraries have circular dependencies that break
          // when split into separate chunks
          // if (id.includes("node_modules/recharts") ||
          //     id.includes("node_modules/d3-")) {
          //   return "charts";
          // }
          // Radix UI components
          if (id.includes("node_modules/@radix-ui/")) {
            return "radix-ui";
          }
          // TanStack Query
          if (id.includes("node_modules/@tanstack/")) {
            return "tanstack";
          }
          // Lucide icons - inline to avoid initialization order issues
          // if (id.includes("node_modules/lucide-react/")) {
          //   return "icons";
          // }
          // Other UI libraries
          if (id.includes("node_modules/sonner/") ||
              id.includes("node_modules/vaul/") ||
              id.includes("node_modules/cmdk/")) {
            return "ui-libs";
          }
          // Date utilities
          if (id.includes("node_modules/date-fns/") ||
              id.includes("node_modules/react-day-picker/")) {
            return "date-utils";
          }
        },
      },
    },
  },
}));
