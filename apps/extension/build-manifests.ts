import fs from 'fs';
import path from 'path';

// Define the source manifest path and the target builds
const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
const manifestStr = fs.readFileSync(manifestPath, 'utf-8');
const manifest = JSON.parse(manifestStr);

// 1. CHROME BUILD (Default)
const chromeManifest = { ...manifest };
const chromeDistPath = path.resolve(process.cwd(), 'dist/manifest.json');

// Ensure dist exists (vite builds it, but just in case this runs before)
if (!fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
  fs.mkdirSync(path.resolve(process.cwd(), 'dist'), { recursive: true });
}
fs.writeFileSync(chromeDistPath, JSON.stringify(chromeManifest, null, 2));


// 2. FIREFOX BUILD
const firefoxDistDir = path.resolve(process.cwd(), 'dist-firefox');
if (!fs.existsSync(firefoxDistDir)) {
  fs.mkdirSync(firefoxDistDir, { recursive: true });
}

// Copy everything from dist to dist-firefox
function copyDir(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy built assets from dist to dist-firefox
// Exclude the manifest.json as we'll write a new one
copyDir(path.resolve(process.cwd(), 'dist'), firefoxDistDir);

// Modify manifest for Firefox
const firefoxManifest = { ...manifest };

// Firefox MV3 background scripts use "scripts" instead of "service_worker"
// And we'll just inject the same background.js as a background script.
firefoxManifest.background = {
  "scripts": ["background.js"]
};
// Firefox does not support "type": "module" in background scripts in MV3 yet out of the box in the same way,
// but since Vite bundles everything into a single IIFE or standard script, "scripts" array works.

// Add specific browser_specific_settings required by AMO
firefoxManifest.browser_specific_settings = {
  "gecko": {
    "id": "extension@digitaleu.me",
    "strict_min_version": "109.0"
  }
};

const firefoxManifestPath = path.join(firefoxDistDir, 'manifest.json');
fs.writeFileSync(firefoxManifestPath, JSON.stringify(firefoxManifest, null, 2));

console.log('✅ Extension manifests built for Chrome (dist/) and Firefox (dist-firefox/)');