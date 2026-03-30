import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { BASE_PATH } from "./project.config";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? BASE_PATH + "/" : "/",
  plugins: [
    react(),
    visualizer({ open: false, gzipSize: true, filename: "dist/stats.html" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@mantine")) {
            return "vendor-mantine";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/react-markdown") || id.includes("node_modules/react-syntax-highlighter")) {
            return "vendor-markdown";
          }
        },
      },
    },
  },
}));
