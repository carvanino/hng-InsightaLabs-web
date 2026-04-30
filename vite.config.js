import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const { HOST } = process.env;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API and auth calls to backend during development
      "/api": `http://${HOST}:3004`,
      "/auth": `http://${HOST}:3004`,
      "/csrf-token": `http://${HOST}:3004`,
    },
  },
});
