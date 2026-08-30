import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import config from "./src/data/config.json";

function siteMetaPlugin(): Plugin {
  const ogImage = `${config.siteUrl.replace(/\/$/, "")}${config.ogImage}`;

  return {
    name: "site-meta",
    transformIndexHtml(html) {
      return html
        .replaceAll("__SITE_TITLE__", config.siteTitle)
        .replaceAll("__SITE_DESCRIPTION__", config.siteDescription)
        .replaceAll("__OG_TITLE__", config.ogTitle)
        .replaceAll("__OG_DESCRIPTION__", config.ogDescription)
        .replaceAll("__SITE_URL__", config.siteUrl.replace(/\/$/, ""))
        .replaceAll("__THEME_COLOR__", config.themeColor)
        .replaceAll("__OG_IMAGE__", ogImage);
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), siteMetaPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
