<template>
  <div
    :class="[
      'relative flex flex-col items-center justify-center min-h-64 py-6 px-6 rounded-lg shadow-lg border border-base-200/10 w-full max-w-lg mx-auto',
      uiConfig.bgClass,
    ]"
    style="backdrop-filter: blur(2px)"
  >
    <!-- Botón pequeño para eliminar este ticket de los resultados -->
    <button
      class="btn btn-ghost btn-xs absolute top-3 right-3"
      aria-label="Eliminar ticket"
      @click="removeTicket"
    >
      <UiIcon name="heroicons:trash" class="w-4 h-4 text-error" />
    </button>
    <!-- Mensaje de estado del registro -->
    <div
      v-if="statusMessage"
      :class="[
        'w-full mb-4 px-4 py-3 rounded-lg text-sm font-semibold text-center shadow-md',
        statusColor || 'bg-base-300 text-base-content',
      ]"
      style="
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        backdrop-filter: blur(4px);
      "
    >
      {{ statusMessage }}
    </div>

    <Entrada :data="data" :icon="uiConfig.icon" />

    <Acciones
      :data="data"
      :scan-mode="scanMode"
      :show-access-buttons="!!showAccessButtons"
      :is-processing="isProcessing"
      :entry-button-text="entryButtonText"
      :entry-button-class="entryButtonClass"
      :result-message="resultMessage"
      :result-icon="resultIcon"
      :result-icon-class="resultIconClass"
      @request-entry="onRequestEntry"
      @request-exit="onRequestExit"
      @auto-entry="onAutoEntry"
    />
  </div>
</template>

<script setup lang="ts">
import UiIcon from "~/components/ui/Icon.vue";
import Entrada from "./Entrada.vue";
import Acciones from "./Acciones.vue";
import { defineProps } from "vue";
import { useTicketAccess } from "./useTicketAccess";
import { useAccessActions } from "./useAccessActions";
import { useLocationsStore } from "~/src/stores/paseshow/locations";

const props = defineProps<{
  data: any;
  showAccessButtons?: boolean;
  scanMode?: string | null;
  statusMessage?: string;
  statusColor?: string;
}>();

// DEBUG: Log para verificar si se reciben los props
if (props.statusMessage) {
  console.log("[TicketCard] Status message received:", {
    statusMessage: props.statusMessage,
    statusColor: props.statusColor,
  });
}

const { uiConfig, setJustRegistered } = useTicketAccess({
  data: (props as any).data,
  scanMode: (props as any).scanMode,
});

const {
  isProcessing,
  resultMessage,
  resultIcon,
  resultIconClass,
  entryButtonText,
  entryButtonClass,
  handleEntry,
  handleExit,
} = useAccessActions({ data: (props as any).data });

const onRequestEntry = async () => {
  const res = await handleEntry();
  if (res?.success) setJustRegistered(true);
};
const onRequestExit = async () => {
  const res = await handleExit();
  if (res?.success) setJustRegistered(false);
};
const onAutoEntry = async () => {
  // await onRequestEntry();
};

// Eliminar ticket específico de los resultados (useLocationsStore.lastQR)
const locationsStore = useLocationsStore();
const removeTicket = () => {
  try {
    const payload = (props as any).data;
    if (!payload) return;
    const keyId = payload?.id ?? payload?.reservaId?.id ?? null;

    // Buscar en el array de lastQR por id o por comparación profunda si no hay id
    const idx = locationsStore.lastQR.findIndex((it: any) => {
      const itId = it?.id ?? it?.reservaId?.id ?? null;
      if (keyId && itId) return String(itId) === String(keyId);
      try {
        return JSON.stringify(it) === JSON.stringify(payload);
      } catch (e) {
        return false;
      }
    });

    if (idx > -1) {
      locationsStore.lastQR.splice(idx, 1);
    }
  } catch (e) {
    console.error("Error removing ticket from locationsStore:", e);
  }
};
</script>
