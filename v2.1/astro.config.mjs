import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [],
  site: "https://erudika.com",

  vite: {
    plugins: [tailwindcss()]
  }
});