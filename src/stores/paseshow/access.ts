/**
 * Store para manejar configuración de acceso y tokens
 */
import { defineStore } from "pinia";
import {
  AccessService,
  type AccessRegistration,
} from "~/src/services/paseshow/access";

export const useAccessStore = defineStore("access", () => {
  // Estado
  const isOnline = ref(true);
  const currentToken = ref("");
  const apiUrl = ref("https://api.paseshow.com.ar");

  // Estado para registro de accesos
  const isRegistering = ref(false);
  const lastRegistrationResult = ref<{
    success: boolean;
    message: string;
  } | null>(null);

  // Configuración del tipo de escaneo
  const scanType = ref("preguntar"); // 'continuo ingreso', 'continuo salida', 'preguntar', 'continuo ingreso y salida'

  // Sectores activos para validación
  const activeSectors = ref<string[]>([]);

  // Configuración de desarrollo/producción
  const isDemoMode = ref(process.env.NODE_ENV === "development");

  // Getters
  const hasValidToken = computed(() => currentToken.value.length > 0);
  const isOfflineMode = computed(
    () => !isOnline.value || currentToken.value === "offline"
  );

  // Actions
  const setToken = (token: string) => {
    currentToken.value = token;
  };

  const setOnlineMode = (online: boolean) => {
    isOnline.value = online;
  };

  const setScanType = (type: string) => {
    scanType.value = type;
  };

  const setActiveSectors = (sectors: string[]) => {
    activeSectors.value = sectors;
  };

  const addActiveSector = (sectorId: string) => {
    if (!activeSectors.value.includes(sectorId)) {
      activeSectors.value.push(sectorId);
    }
  };

  const setDemoMode = (demo: boolean) => {
    isDemoMode.value = demo;
  };

  const removeActiveSector = (sectorId: string) => {
    const index = activeSectors.value.indexOf(sectorId);
    if (index > -1) {
      activeSectors.value.splice(index, 1);
    }
  };

  // Validar si un sector está activo
  const isSectorActive = (sectorId: string): boolean => {
    return activeSectors.value.includes(sectorId);
  };

  // Obtener configuración para mostrar botones según tipo de escaneo
  const getButtonsConfig = () => {
    switch (scanType.value) {
      case "continuo ingreso":
        return {
          showEntry: true,
          showExit: false,
          autoAction: "continuo ingreso",
        };
      case "continuo salida":
        return {
          showEntry: false,
          showExit: true,
          autoAction: "continuo salida",
        };
      case "continuo ingreso y salida":
        return {
          showEntry: true,
          showExit: true,
          autoAction: "continuo ingreso y salida",
        };
      case "preguntar":
      default:
        return { showEntry: true, showExit: true, autoAction: null };
    }
  };

  /**
   * Valida el estado del ticket y determina el color según el modo de escaneo
   * @param ticketData - Datos del ticket
   * @param actionType - "E" para entrada, "S" para salida
   * @returns { isValid: boolean, color: string, message: string }
   */
  const validateTicketState = (
    ticketData: any,
    actionType: "E" | "S"
  ): { isValid: boolean; color: string; message: string } => {
    const currentState = ticketData.ingreso || ticketData.estado || "N";

    if (actionType === "E") {
      // CONTINUO INGRESO: Validar entrada
      if (currentState === "E") {
        // Ya está adentro - ERROR
        return {
          isValid: false,
          color: "bg-error text-error-content",
          message: "⚠️ ESTA PERSONA YA ESTABA ADENTRO",
        };
      } else {
        // Puede ingresar - OK
        return {
          isValid: true,
          color: "bg-success text-success-content",
          message: "✅ INGRESO REGISTRADO CORRECTAMENTE",
        };
      }
    } else {
      // CONTINUO SALIDA: Validar salida
      if (currentState === "S") {
        // Ya está afuera - ERROR
        return {
          isValid: false,
          color: "bg-error text-error-content",
          message: "⚠️ ESTA PERSONA SUPUESTAMENTE HABÍA SALIDO",
        };
      } else {
        // Puede salir - OK
        return {
          isValid: true,
          color: "bg-info text-info-content", // CELESTE
          message: "✅ SALIDA REGISTRADA CORRECTAMENTE",
        };
      }
    }
  };

  /**
   * Registra un ingreso (entrada) de una persona
   * @param ticketData - Datos del ticket escaneado
   * @returns Resultado del registro con success, message y color
   */
  const registerEntry = async (ticketData: any) => {
    if (!currentToken.value) {
      return {
        success: false,
        message: "ERROR: No hay token de autenticación",
        color: "bg-error text-error-content",
      };
    }

    // Validar estado del ticket
    const validation = validateTicketState(ticketData, "E");

    isRegistering.value = true;
    try {
      // Convertir datos del ticket a formato de registro
      const registrationData = AccessService.ticketToRegistration(ticketData);

      // Asignar tipo de acceso: E = Entrada/Ingreso
      registrationData.ingreso = "E";

      // Llamar al servicio para registrar
      const result = await AccessService.registerAccess(
        currentToken.value,
        registrationData
      );

      const finalResult = {
        ...result,
        color: validation.color,
        isValid: validation.isValid,
      };

      lastRegistrationResult.value = finalResult;
      return finalResult;
    } catch (error: any) {
      const errorResult = {
        success: false,
        message: `ERROR: ${error.message || "Error desconocido"}`,
        color: "bg-error text-error-content",
        isValid: false,
      };
      lastRegistrationResult.value = errorResult;
      return errorResult;
    } finally {
      isRegistering.value = false;
    }
  };

  /**
   * Registra una salida de una persona
   * @param ticketData - Datos del ticket escaneado
   * @returns Resultado del registro con success, message y color
   */
  const registerExit = async (ticketData: any) => {
    if (!currentToken.value) {
      return {
        success: false,
        message: "ERROR: No hay token de autenticación",
        color: "bg-error text-error-content",
      };
    }

    // Validar estado del ticket
    const validation = validateTicketState(ticketData, "S");

    isRegistering.value = true;
    try {
      // Convertir datos del ticket a formato de registro
      const registrationData = AccessService.ticketToRegistration(ticketData);

      // Asignar tipo de acceso: S = Salida
      registrationData.ingreso = "S";

      // Llamar al servicio para registrar
      const result = await AccessService.registerAccess(
        currentToken.value,
        registrationData
      );

      const finalResult = {
        ...result,
        color: validation.color,
        isValid: validation.isValid,
      };

      lastRegistrationResult.value = finalResult;
      return finalResult;
    } catch (error: any) {
      const errorResult = {
        success: false,
        message: `ERROR: ${error.message || "Error desconocido"}`,
        color: "bg-error text-error-content",
        isValid: false,
      };
      lastRegistrationResult.value = errorResult;
      return errorResult;
    } finally {
      isRegistering.value = false;
    }
  };

  /**
   * Registra acceso automático según el tipo de escaneo configurado
   * @param ticketData - Datos del ticket escaneado
   * @returns Resultado del registro o null si es modo "preguntar"
   */
  const registerAutoAccess = async (ticketData: any) => {
    const config = getButtonsConfig();

    // Si es modo "preguntar", no hacer nada automático
    if (config.autoAction === null) {
      return null;
    }

    // Registrar según configuración
    if (config.autoAction === "continuo ingreso") {
      return await registerEntry(ticketData);
    } else if (config.autoAction === "continuo salida") {
      return await registerExit(ticketData);
    } else if (config.autoAction === "continuo ingreso y salida") {
      // Lógica para alternar automáticamente según estado actual
      // Si el ticket está "afuera" (estado S) -> registrar entrada
      // Si el ticket está "adentro" (estado E) -> registrar salida
      const currentState = ticketData.ingreso || ticketData.estado || "N";
      if (currentState === "S" || currentState === "N") {
        return await registerEntry(ticketData);
      } else {
        return await registerExit(ticketData);
      }
    }

    return null;
  };

  return {
    // Estado
    isOnline,
    currentToken,
    apiUrl,
    scanType,
    activeSectors,
    isDemoMode,
    isRegistering,
    lastRegistrationResult,

    // Getters
    hasValidToken,
    isOfflineMode,

    // Actions
    setToken,
    setOnlineMode,
    setScanType,
    setActiveSectors,
    addActiveSector,
    removeActiveSector,
    setDemoMode,
    isSectorActive,
    getButtonsConfig,

    // Métodos de registro
    registerEntry,
    registerExit,
    registerAutoAccess,
  };
});
