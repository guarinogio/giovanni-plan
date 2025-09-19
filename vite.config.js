import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// GH Pages sirve bajo /giovanni-plan/
const isCI = process.env.GITHUB_ACTIONS === "true";
const base = isCI ? "/giovanni-plan/" : "/";

export default defineConfig({
  base, // 👈 asegura URLs correctas en GitHub Pages
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      // SW generado automáticamente
      registerType: "autoUpdate",
      injectRegister: "auto", // inline/auto: evita rutas raras en Pages
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "robots.txt"
      ],
      manifest: {
        name: "Plan de Fuerza — Giovanni",
        short_name: "Plan Giovanni",
        description:
          "Plan de fuerza con temporizador de descansos, progresiones, ajustes y registro offline.",
        lang: "es",
        dir: "ltr",
        start_url: `${base}`,          // 👈 importante para Pages
        scope: `${base}`,              // 👈 importante para Pages
        display: "standalone",
        theme_color: "#0ea5e9",        // debe coincidir con <meta name="theme-color">
        background_color: "#ffffff",
        orientation: "portrait",
        categories: ["fitness", "health", "productivity"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        // (Opcional) accesos directos
        shortcuts: [
          {
            name: "Sesión",
            short_name: "Sesión",
            url: `${base}?tab=session`
          },
          {
            name: "Plan",
            short_name: "Plan",
            url: `${base}?tab=plan`
          },
          {
            name: "Historial",
            short_name: "Historial",
            url: `${base}?tab=history`
          }
        ]
      },
      workbox: {
        // Cachea los assets generados y estáticos
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        // SPA fallback para rutas internas en Pages
        navigateFallback: "index.html",
        // (Opcional) ignora llamadas a APIs externas
        // navigateFallbackDenylist: [/^\/api\//]
      },
      devOptions: {
        enabled: true  // habilita PWA en dev para probar
      }
    })
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
