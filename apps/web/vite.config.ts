/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

function sitemapPlugin() {
  return {
    name: "generate-sitemap",
    closeBundle() {
      const alternativesSrc = fs.readFileSync(
        path.resolve(import.meta.dirname, "../../packages/shared/src/alternatives.ts"),
        "utf-8"
      );
      const ids = Array.from(alternativesSrc.matchAll(/"id":\s*"([^"]+)"/g), (m) => m[1]);

      const BASE = "https://digitaleu.me";
      const today = new Date().toISOString().split("T")[0];

      const staticUrls = [
        { p: "/", freq: "weekly", pri: "1.0" },
        { p: "/directory", freq: "weekly", pri: "0.9" },
        { p: "/guides", freq: "monthly", pri: "0.8" },
        { p: "/about", freq: "monthly", pri: "0.5" },
      ];

      const entries = [
        ...staticUrls.map(({ p, freq, pri }) => ({ p, freq, pri })),
        ...ids.map((id) => ({ p: `/directory/${id}`, freq: "monthly", pri: "0.7" })),
      ]
        .map(
          ({ p, freq, pri }) =>
            `  <url>\n    <loc>${BASE}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`
        )
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
      fs.writeFileSync(path.resolve(import.meta.dirname, "dist/sitemap.xml"), xml, "utf-8");
      console.log(`✓ sitemap.xml — ${staticUrls.length + ids.length} URLs`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
