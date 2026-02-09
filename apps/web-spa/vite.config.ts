import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "https://erasys-test-web-nextjs.vercel.app",
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
