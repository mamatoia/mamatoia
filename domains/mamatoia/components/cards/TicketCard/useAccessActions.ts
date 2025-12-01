import { ref, computed, type Ref } from "vue";
import { AccessService } from "~/src/services/paseshow/access";
import { useAccessStore } from "~/src/stores/paseshow/access";
import { useLocationsStore } from "~/src/stores/paseshow/locations";
import type { TicketDataLike } from "./useTicketAccess";

export function useAccessActions(options: {
  data: Ref<TicketDataLike | null | undefined> | TicketDataLike | null;
}) {
  const accessStore = useAccessStore();
  const locationsStore = useLocationsStore();

  const isProcessing = ref(false);
  const resultMessage = ref("");
  const resultMessageType = ref<"success" | "error" | "info" | "">("");
  const localSessionStatus = ref<"N" | "E" | "S">("N");

  const dataRef = computed<TicketDataLike | null>(() => {
    const d = (options.data as any)?.value ?? options.data;
    return (d as TicketDataLike) || null;
  });

  const entryButtonText = computed(() =>
    localSessionStatus.value === "N" ? "INGRESAR" : "REINGRESAR"
  );
  const entryButtonClass = computed(() => "btn-success hover:btn-success");

  const resultIcon = computed(() => {
    switch (resultMessageType.value) {
      case "success":
        return "outline:check-circle";
      case "error":
        return "outline:x-circle";
      case "info":
        return "outline:information-circle";
      default:
        return "outline:information-circle";
    }
  });
  const resultIconClass = computed(() => {
    switch (resultMessageType.value) {
      case "success":
        return "text-success";
      case "error":
        return "text-error";
      case "info":
        return "text-info";
      default:
        return "text-base-content/70";
    }
  });

  const handleEntry = async () => {
    const d = dataRef.value;
    if (!d) return { success: false, message: "No data" } as const;
    if (d.ingreso === "E") {
      resultMessage.value = "USUARIO YA ADENTRO";
      resultMessageType.value = "error";
      return { success: false, message: resultMessage.value } as const;
    }

    isProcessing.value = true;
    resultMessage.value = "";
    const successMessage =
      localSessionStatus.value === "N"
        ? "INGRESO REGISTRADO CORRECTAMENTE"
        : "REINGRESO REGISTRADO CORRECTAMENTE";

    try {
      const registrationData = AccessService.ticketToRegistration(d);
      registrationData.ingreso = "E";
      registrationData.estado = d.ingreso || "N";

      const token = accessStore.currentToken;
      const result = await AccessService.registerAccess(
        token,
        registrationData
      );

      if (result.success) {
        localSessionStatus.value = "E";
        resultMessage.value = successMessage;
        resultMessageType.value = "success";
        try {
          (d as any).ingreso = "E";
          const idToMatch = (d as any)?.id;
          if (idToMatch) locationsStore.setLocalIngreso(idToMatch, "E");
        } catch {}
        try {
          const idToMatch = (d as any)?.id;
          if (idToMatch) {
            for (let i = 0; i < locationsStore.lastQR.length; i++) {
              if ((locationsStore.lastQR[i] as any)?.id === idToMatch) {
                (locationsStore.lastQR[i] as any).ingreso = "E";
              }
            }
            for (let i = 0; i < locationsStore.lastDNI.length; i++) {
              if ((locationsStore.lastDNI[i] as any)?.id === idToMatch) {
                (locationsStore.lastDNI[i] as any).ingreso = "E";
              }
            }
          }
        } catch (e) {
          console.warn(
            "Could not update locationsStore after registration:",
            e
          );
        }
        return { success: true, message: resultMessage.value } as const;
      } else {
        resultMessage.value = result.message;
        resultMessageType.value = "error";
        return { success: false, message: result.message } as const;
      }
    } catch (error) {
      resultMessage.value = "ERROR: No se pudo registrar el ingreso";
      resultMessageType.value = "error";
      console.error("handleEntry error:", error);
      return { success: false, message: resultMessage.value } as const;
    } finally {
      isProcessing.value = false;
    }
  };

  const handleExit = async () => {
    const d = dataRef.value;
    if (!d) return { success: false, message: "No data" } as const;

    isProcessing.value = true;
    resultMessage.value = "";

    try {
      const registrationData = AccessService.ticketToRegistration(d);
      registrationData.ingreso = "S";
      registrationData.estado = d.ingreso || "N";

      const token = accessStore.currentToken;
      const result = await AccessService.registerAccess(
        token,
        registrationData
      );

      if (result.success) {
        localSessionStatus.value = "S";
        resultMessage.value = "SALIDA REGISTRADA CORRECTAMENTE";
        resultMessageType.value = "success";
        try {
          (d as any).ingreso = "S";
        } catch {}
        try {
          const idToMatch = (d as any)?.id;
          if (idToMatch) {
            for (let i = 0; i < locationsStore.lastQR.length; i++) {
              if ((locationsStore.lastQR[i] as any)?.id === idToMatch) {
                (locationsStore.lastQR[i] as any).ingreso = "S";
              }
            }
            for (let i = 0; i < locationsStore.lastDNI.length; i++) {
              if ((locationsStore.lastDNI[i] as any)?.id === idToMatch) {
                (locationsStore.lastDNI[i] as any).ingreso = "S";
              }
            }
          }
        } catch (e) {
          console.warn(
            "Could not update locationsStore after exit registration:",
            e
          );
        }
        return { success: true, message: resultMessage.value } as const;
      } else {
        resultMessage.value = result.message;
        resultMessageType.value = "error";
        return { success: false, message: result.message } as const;
      }
    } catch (error) {
      resultMessage.value = "ERROR: No se pudo registrar la salida";
      resultMessageType.value = "error";
      console.error("handleExit error:", error);
      return { success: false, message: resultMessage.value } as const;
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    isProcessing,
    resultMessage,
    resultMessageType,
    resultIcon,
    resultIconClass,
    entryButtonText,
    entryButtonClass,
    handleEntry,
    handleExit,
  } as const;
}
