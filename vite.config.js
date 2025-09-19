import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      // rollback: service worker generado automáticamente (sin lógica propia)
      strategies: "generateSW",
      registerType: "autoUpdate",
      manifest: {
        name: "Plan de Fuerza — Giovanni",
        short_name: "Fuerza Gio",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#0f172a",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        // cachea los assets básicos; sin notificaciones ni lógica extra
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
      }
    })
  ]
});
