import { useLocationsStore } from "~/src/stores/paseshow/locations";
import { useAccessStore } from "~/src/stores/paseshow/access";

export async function consultarQR({ qr, sectorEventoId }) {
  const locations = useLocationsStore();
  return locations.consultaQR({ qr, sectorEventoId });
}

/**
 * Registra acceso automático o manual según configuración
 * @param {object} params - { qr, sectorEventoId, ticketData, forceAction }
 * @param {string} params.forceAction - "E" para forzar entrada, "S" para forzar salida, undefined para automático
 * @returns {Promise<{ok: boolean, mensaje: string, color: string}>}
 */
export async function registrarAcceso({
  qr,
  sectorEventoId,
  ticketData,
  forceAction,
}) {
  const accessStore = useAccessStore();

  try {
    let result;

    if (forceAction === "E") {
      // Forzar entrada (modo manual - botón Ingresar presionado)
      result = await accessStore.registerEntry(ticketData);
    } else if (forceAction === "S") {
      // Forzar salida (modo manual - botón Salir presionado)
      result = await accessStore.registerExit(ticketData);
    } else {
      // Modo automático según configuración
      result = await accessStore.registerAutoAccess(ticketData);

      // Si es modo "preguntar", no hacer nada automático
      if (result === null) {
        return {
          ok: false,
          mensaje: "Seleccione acción (Ingresar o Salir)",
          color: "bg-warning text-warning-content",
          requiresAction: true,
        };
      }
    }

    return {
      ok: result.success,
      mensaje: result.message,
      color: result.color || "bg-base-200",
      isValid: result.isValid,
    };
  } catch (error) {
    console.error("PaseshowWebViewService Error en registrarAcceso:", error);
    return {
      ok: false,
      mensaje: `Error: ${error.message || "Error desconocido"}`,
      color: "bg-error text-error-content",
    };
  }
}
