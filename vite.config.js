import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          three: [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "three-stdlib",
          ],
          email: ["@emailjs/browser"],
          timeline: ["react-vertical-timeline-component"],
          tilt: ["react-tilt"],
        },
      },
    },

    chunkSizeWarningLimit: 500,
  },
});