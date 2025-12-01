import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineNuxtConfig({
  // Proxy en producción (y SSR) con Nitro Route Rules
  // Esto hace que las rutas locales /api/** y /services/** se reenvíen al backend en prod
  // manteniendo el mismo esquema de reescritura que el proxy de Vite en desarrollo.

  routeRules: {
    "/api/**": {
      proxy: {
        to: "https://api.paseshow.com.ar/**",
      },
    },
    "/services/**": {
      proxy: {
        to: "https://services.paseshow.com.ar/permissions/ms-evento/**",
      },
    },
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_PUBLIC_API_URL || "/api",
      API_SERVICES_URL: process.env.NUXT_PUBLIC_API_SERVICES_URL || "/services",
    },
  },
  devServer: {
    port: 3000,
    host: "localhost",
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssTarget: "chrome61",
    },
    server: {
      proxy: {
        "/api": {
          target: "https://api.paseshow.com.ar",
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, "");
          },
        },
        "/services": {
          target: "https://services.paseshow.com.ar/permissions/ms-evento",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/services/, ""),
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^~\/mamatoia\/(.*)/,
          replacement: resolve(__dirname, "domains/mamatoia/$1"),
        },
        {
          find: /^~\/mamatoia$/,
          replacement: resolve(__dirname, "domains/mamatoia"),
        },
      ],
    },
  },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },
  devtools: { enabled: true }, // Habilita las DevTools en modo desarrollo

  css: ["~/assets/app.css"],
  compatibilityDate: "2025-03-03",
  modules: ["@nuxt/icon", "@pinia/nuxt"],
  pinia: {
    storesDirs: ["~/src/stores/**"],
  },
  icon: {
    // Forzamos que el endpoint local de iconos NO viva bajo /api para evitar choques con el proxy
    // del backend. El handler interno quedará expuesto en /_nuxt_icon/**
    provider: "server",
    localApiEndpoint: "/_nuxt_icon",
    customCollections: [
      {
        prefix: "icons",
        dir: "./assets/icons",
      },
      {
        prefix: "sn",
        dir: "./assets/sn",
      },
    ],
  },
});
