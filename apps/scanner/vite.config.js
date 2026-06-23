import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindPlugin from '@tailwindcss/vite';
import path from 'path';
export default defineConfig({
    plugins: [
        tailwindPlugin(),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5174,
        strictPort: false,
    },
});
