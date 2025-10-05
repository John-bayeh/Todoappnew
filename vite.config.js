import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), // Keep the React plugin
    tailwindcss() // Add the Tailwind CSS Vite plugin
  ]
});
