import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/server": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  plugins: [tailwindcss() ],
});
