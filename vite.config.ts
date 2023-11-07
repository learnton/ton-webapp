import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "./dist",
  },
  base: "/ton-webapp/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
