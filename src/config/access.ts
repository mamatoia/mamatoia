/**
 * Configuración de tokens y endpoints para diferentes entornos
 */

// Configuración por defecto del sistema
export const ACCESS_CONFIG = {
  // Tokens por ambiente
  tokens: {
    development: "demo-token", // Token de desarrollo
    production: "", // Token de producción (debe configurarse)
    staging: "", // Token de staging (debe configurarse)
  },

  // URLs de API por ambiente
  apiUrls: {
    development: "http://localhost:3000",
    production: "https://api.paseshow.com.ar",
    staging: "https://staging-api.paseshow.com.ar",
  },

  // Configuración por defecto
  defaults: {
    scanType: "preguntar",
    isOnline: true,
    demoMode: process.env.NODE_ENV === "development",
  },
};

/**
 * Obtener configuración actual basada en el entorno
 */
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || "development";

  return {
    token:
      ACCESS_CONFIG.tokens[env as keyof typeof ACCESS_CONFIG.tokens] ||
      ACCESS_CONFIG.tokens.development,
    apiUrl:
      ACCESS_CONFIG.apiUrls[env as keyof typeof ACCESS_CONFIG.apiUrls] ||
      ACCESS_CONFIG.apiUrls.development,
    isDemoMode: ACCESS_CONFIG.defaults.demoMode,
    env,
  };
};

/**
 * Verificar si estamos en modo demo
 */
export const isDemoMode = () => {
  const config = getCurrentConfig();
  return config.isDemoMode || config.token === "demo-token";
};
