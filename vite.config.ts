import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), nodePolyfills()],
  build: {
    outDir: "./dist",
  },
  base: "/ton-webapp",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
