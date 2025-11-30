/**
 * Plugin para inicializar el store de acceso con configuración por defecto
 */
import { useAccessStore } from "~/src/stores/paseshow/access";

export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (process.client) {
    const accessStore = useAccessStore();

    // Configuración por defecto basada en la lógica de Android
    accessStore.setToken(process.env.NUXT_DEFAULT_TOKEN || "");
    accessStore.setScanType("preguntar"); // Modo que permite mostrar ambos botones
    accessStore.setOnlineMode(true);

    // TODO: Cargar sectores activos desde configuración o URL actual
    // Por ahora lo haremos dinámicamente desde los componentes
  }
});
