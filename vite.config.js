import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API and auth calls to backend during development
      "/api":        "http://localhost:3004",
      "/auth":       "http://localhost:3004",
      "/csrf-token": "http://localhost:3004",
    },
  },
});
