import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";

// Custom plugin to handle Firefox and Chrome specific builds after Vite finishes
const buildManifests = () => {
  return {
    name: "build-manifests",
    closeBundle: async () => {
      const manifestPath = resolve(__dirname, "public/manifest.json");
      const manifestStr = fs.readFileSync(manifestPath, "utf-8");
      const manifest = JSON.parse(manifestStr);

      // 1. CHROME BUILD (dist/)
      // Dist is already written by Vite, we just need to ensure the manifest is copied/updated.
      const chromeDistPath = resolve(__dirname, "dist/manifest.json");
      fs.writeFileSync(chromeDistPath, JSON.stringify(manifest, null, 2));

      // 2. FIREFOX BUILD (dist-firefox/)
      const firefoxDistDir = resolve(__dirname, "dist-firefox");
      if (!fs.existsSync(firefoxDistDir)) {
        fs.mkdirSync(firefoxDistDir, { recursive: true });
      }

      // Copy dist contents to dist-firefox
      function copyDir(src: string, dest: string) {
        if (!fs.existsSync(src)) return;
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (let entry of entries) {
          const srcPath = resolve(src, entry.name);
          const destPath = resolve(dest, entry.name);
          if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }
      copyDir(resolve(__dirname, "dist"), firefoxDistDir);

      // Modify manifest for Firefox
      const firefoxManifest = { ...manifest };
      
      // Firefox uses "scripts" instead of "service_worker" in MV3 background
      firefoxManifest.background = {
        scripts: ["background.js"]
      };

      // Firefox requires browser_specific_settings
      firefoxManifest.browser_specific_settings = {
        gecko: {
          id: "extension@digitaleu.me",
          strict_min_version: "109.0"
        }
      };

      const firefoxManifestPath = resolve(firefoxDistDir, "manifest.json");
      fs.writeFileSync(firefoxManifestPath, JSON.stringify(firefoxManifest, null, 2));

      console.log("\n✅ Generated manifests for Chrome (dist/) and Firefox (dist-firefox/)");
    }
  };
};

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "src/background.ts"),
        content: resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  plugins: [buildManifests()],
});
