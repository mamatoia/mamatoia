import { ref, computed, type Ref } from "vue";

export interface TicketDataLike {
  id?: number | string;
  dni?: string;
  ingreso?: "N" | "E" | "S" | string;
  reservaId?: { id?: number | string; clienteId?: { nombre?: string } };
  sectorEventoId?:
    | {
        id?: string | number;
        fechaFuncion?: any;
        eventoId?: { nombre?: string };
        sectorId?: { nombre?: string };
      }
    | any;
  ubicacionId?: { fila?: number | string; etiqueta?: string | number };
}

export type ScanMode =
  | string
  | Ref<string | null | undefined>
  | null
  | undefined;

/**
 * useTicketAccess
 * Single-responsibility composable that encapsulates all data mapping, state,
 * and side-effects (service calls, store updates) for a Ticket card.
 * Presentation stays outside in Entrada.vue / Acciones.vue.
 */
export function useTicketAccess(options: {
  data: Ref<TicketDataLike | null | undefined> | TicketDataLike | null;
  scanMode?: ScanMode;
}) {
  // Shared UI state between siblings (Entrada/Acciones) via parent
  const justRegistered = ref(false); // flash green immediately after registering

  const dataRef = computed<TicketDataLike | null>(() => {
    const d = (options.data as any)?.value ?? options.data;
    return (d as TicketDataLike) || null;
  });

  // Helper to get scan mode as string
  const getScanModeString = (): string => {
    try {
      const mode = options.scanMode as any;
      const modeStr = (mode && mode.value ? mode.value : mode) || "";
      return String(modeStr).toLowerCase().trim();
    } catch {
      return "";
    }
  };

  // Nota: Los cálculos de presentación (eventName, fecha, etc.) ahora residen en Entrada.vue

  // Config (bg + icon) for the wrapper
  const uiConfig = computed(() => {
    const mode = getScanModeString();
    const ingreso = dataRef.value?.ingreso;

    // MODO: CONTINUO INGRESO
    if (mode.includes("continuo") && mode.includes("ingreso")) {
      if (ingreso === "E") {
        // 🔴 ESTA PERSONA YA ESTABA ADENTRO
        return {
          bgClass: "bg-error text-error-content",
          icon: "outline:x-circle",
        } as const;
      }
      // 🟢 Puede ingresar
      return {
        bgClass: "bg-success text-success-content",
        icon: "outline:check-circle",
      } as const;
    }

    // MODO: CONTINUO SALIDA
    if (mode.includes("continuo") && mode.includes("salida")) {
      if (ingreso === "S") {
        // 🔴 ESTA PERSONA SUPUESTAMENTE HABÍA SALIDO
        return {
          bgClass: "bg-error text-error-content",
          icon: "outline:x-circle",
        } as const;
      }
      // 🔵 CELESTE - Puede salir
      return {
        bgClass: "bg-info text-info-content",
        icon: "outline:arrow-left-on-rectangle",
      } as const;
    }

    // MODO: Por defecto (manual)
    if (ingreso === "E") {
      return {
        bgClass: "bg-error text-error-content",
        icon: "outline:x-circle",
      } as const;
    }
    // Verde: ticket válido o recién registrado
    return {
      bgClass: "bg-success text-success-content",
      icon: "outline:check-circle",
    } as const;
  });

  // Nota: La lógica de botones, textos y mensajes se movió a Acciones.vue

  // Nota: El flujo de auto-acción por `scanMode` también se movió a Acciones.vue

  return {
    // shared state
    uiConfig,
    justRegistered,
    setJustRegistered: (v: boolean) => (justRegistered.value = v),
    dataRef,
  } as const;
}
