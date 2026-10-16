import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Relative base: assets, manifest scope and the service worker resolve against wherever the
// app is served (e.g. https://user.github.io/<repo>/), so no repo name needs to be hardcoded.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,json,webmanifest}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "56-Day Interview Prep Tracker",
        short_name: "Prep Tracker",
        description: "Track a 56-day DSA, HLD, LLD and AI interview prep plan. Works offline.",
        display: "standalone",
        start_url: "./",
        scope: "./",
        theme_color: "#2457d6",
        background_color: "#0f1215",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  test: {
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
  },
});
