import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// GH Pages sirve bajo /giovanni-plan/
const isCI = process.env.GITHUB_ACTIONS === "true";
const base = isCI ? "/giovanni-plan/" : "/";

export default defineConfig({
  base, // 👈 clave para que las URLs de assets apunten a /giovanni-plan/ en Pages
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      // SW generado automáticamente (sin lógica custom)
      strategies: "generateSW",
      registerType: "autoUpdate",
      // Habilita el SW también en dev para probar
      devOptions: { enabled: true },

      // Manifest PWA: usa base para start_url y scope
      manifest: {
        name: "Plan de Fuerza — Giovanni",
        short_name: "Fuerza Gio",
        start_url: base,     // 👈 debe coincidir con base
        scope: base,         // 👈 igual que base
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#0f172a",
        icons: [
          // Importante: SIN "/" inicial para que Vite preprenda base
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          // (opcional) Apple touch icon si lo tienes en /public
          { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png" }
        ]
      },

      // Qué ficheros precachear
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
      },

      // (opcional) registra el SW en línea para evitar rutas raras
      injectRegister: "inline"
    })
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
