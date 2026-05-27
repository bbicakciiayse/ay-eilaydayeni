import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["ay-eilaydayeni-production.up.railway.app", ".up.railway.app"],
  },
});
