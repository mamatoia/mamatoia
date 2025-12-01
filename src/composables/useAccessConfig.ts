/**
 * Ejemplo de composable para inicializar configuración de acceso
 * basada en la URL actual y parámetros de la aplicación
 */
import { useAccessStore } from "~/src/stores/paseshow/access";
import { useRoute } from "vue-router";

export const useAccessConfig = () => {
  const accessStore = useAccessStore();
  const route = useRoute();

  const initializeAccess = () => {
    // Obtener sector actual de la URL si está disponible
    const currentSector = route.params.sector as string;
    if (currentSector) {
      accessStore.addActiveSector(currentSector);
    }

    // Configurar tipo de escaneo basado en preferencias
    // Evitar sobreescribir una configuración que el usuario haya seleccionado
    // previamente (p. ej. via UI). Solo establecer un valor por defecto si no
    // existe uno ya guardado en localStorage y el store no tiene valor.
    const storedScanType = localStorage.getItem("scanType");
    if (storedScanType) {
      accessStore.setScanType(storedScanType);
    }

    // Configurar token si está disponible
    // (esto podría venir del login o configuración)
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      accessStore.setToken(storedToken);
    }

    console.log("🎯 Configuración de acceso inicializada:", {
      sectors: accessStore.activeSectors,
      scanType: accessStore.scanType,
      hasToken: accessStore.hasValidToken,
    });
  };

  return { initializeAccess };
};
