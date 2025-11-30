// `#app` is provided by Nuxt at runtime — silence TypeScript in editors where types aren't available
// @ts-ignore
import { useRuntimeConfig } from "#app";

// Export getters so the values are read from runtime config (public)
// This lets you configure the URLs in production via NUXT_PUBLIC_... env vars
export function getApiUrls() {
  const config = useRuntimeConfig();
  return {
    API_URL: config.public?.API_URL || "/api",
    API_SERVICES_URL: config.public?.API_SERVICES_URL || "/services",
  };
}

export function getApiUrl() {
  return getApiUrls().API_URL;
}

export function getApiServicesUrl() {
  return getApiUrls().API_SERVICES_URL;
}
