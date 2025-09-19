import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// GH Pages sirve bajo /giovanni-plan/
const isCI = process.env.GITHUB_ACTIONS === "true";
const base = isCI ? "/giovanni-plan/" : "/";

// PWA en dev opcional (evita warnings por glob en dev-dist)
const enablePwaInDev = process.env.VITE_ENABLE_PWA_DEV === "true";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "robots.txt"],
      manifest: {
        name: "Plan de Fuerza — Giovanni",
        short_name: "Plan Giovanni",
        description:
          "Plan de fuerza con temporizador de descansos, progresiones, ajustes y registro offline.",
        lang: "es",
        dir: "ltr",
        start_url: `${base}`,
        scope: `${base}`,
        display: "standalone",
        theme_color: "#0ea5e9",
        background_color: "#ffffff",
        orientation: "portrait",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "pwa-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ],
        shortcuts: [
          { name: "Sesión", short_name: "Sesión", url: `${base}?tab=session` },
          { name: "Plan", short_name: "Plan", url: `${base}?tab=plan` },
          { name: "Historial", short_name: "Historial", url: `${base}?tab=history` }
        ]
      },
      workbox: {
        // Mantener sólo en build (dist). En dev no hay archivos aún -> evitar warnings.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        navigateFallback: "index.html"
      },
      // Desactivar PWA en dev, a menos que lo fuerces con VITE_ENABLE_PWA_DEV=true
      devOptions: {
        enabled: enablePwaInDev
      }
    })
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
