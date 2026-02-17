import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    //drop: ["console", "debugger"],
    legalComments: "none",
  },
  build: {
    target: "esnext", 
    sourcemap: false, 
    minify: "esbuild",

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          mediasoup: ["mediasoup-client"],
        },
      },
    },
  },
});
