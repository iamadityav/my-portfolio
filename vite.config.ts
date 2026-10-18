import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Keep this in sync with your GitHub Pages repo name
  base: '/my-portfolio/',
  plugins: [
    react(),
    tailwindcss(), // <-- without this, every Tailwind class is ignored
  ],
});