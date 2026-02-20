import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/contexts/**", "src/features/auth/schemas/**", "src/features/dashboard/data/**", "src/features/dashboard/hooks/**"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "**/*.config.*", "**/types/**", "src/components/**", "src/pages/**", "src/layouts/**", "src/features/dashboard/components/**", "src/App.tsx", "src/AppShell.tsx", "src/main.tsx", "src/hooks/**", "src/contexts/index.ts", "src/features/auth/schemas/index.ts", "src/features/dashboard/hooks/index.ts", "src/features/dashboard/data/index.ts", "src/lib/**"],
      thresholds: {
        lines: 90,
        functions: 80,
        branches: 77,
        statements: 90
      }
    },
    reporters: ["verbose"],
    alias: {
      "@/": path.resolve(__dirname, "./src/")
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
