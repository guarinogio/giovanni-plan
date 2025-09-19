import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      // usa un nombre de salida distinto al de entrada
      filename: "sw.js",
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
      injectManifest: {
        // qué ficheros precachear
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        swSrc: "src/sw-countdown.js", // tu SW de origen
      }
    })
  ]
});
