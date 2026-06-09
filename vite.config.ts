import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/v1": {
        target: "https://api.doutorcashapp.com.br",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    mode === "production" && compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    mode === "analyze" && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html",
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'doutorcash - Organize suas finanças pelo WhatsApp',
        short_name: 'doutorcash',
        description: 'Organize suas finanças pessoais pelo WhatsApp com IA',
        theme_color: '#25D366',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // JS chunks NÃO são precacheados nem cacheados pelo SW.
        // Motivo: chunks têm hash no nome + Cache-Control: immutable no HTTP.
        // SW cacheando JS impedia reload automático de pegar chunks novos após deploy.
        globPatterns: ['**/*.{html,css,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 300 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    target: 'es2020',
    cssMinify: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        compact: true,
        generatedCode: {
          constBindings: true,
          objectShorthand: true,
        },
        manualChunks(id) {
          // React core — cache longo, raramente muda
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Router
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // TanStack Query
          if (id.includes('node_modules/@tanstack/')) {
            return 'vendor-query';
          }
          // framer-motion — chunk separado: agora só usado em componentes lazy
          // (Hero e HowItWorks não dependem mais dele → não entra no bundle inicial)
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer';
          }
          // @radix-ui — NÃO isolar (usa useLayoutEffect/createContext do React;
          // chunk separado causa "Cannot read properties of undefined" em produção)
          // recharts/d3 — NÃO isolar em chunk separado (deps circulares causam
          // "Cannot access before initialization" em produção)
          // Formulários
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform/') || id.includes('node_modules/zod')) {
            return 'vendor-forms';
          }
          // vendor-ui-utils removido — next-themes/cmdk usam import * as React
          // e causam createContext crash quando em chunk separado do vendor-react
        },
      },
      treeshake: {
        moduleSideEffects: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-router',
      '@tanstack/react-query',
      'recharts',
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
    ],
    exclude: ['@radix-ui/react-dialog'],
  },
}));
