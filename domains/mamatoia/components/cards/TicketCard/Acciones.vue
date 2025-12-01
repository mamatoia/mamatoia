<template>
  <div
    v-if="showAccessButtons && !isContinuousMode"
    class="flex flex-col gap-3 mt-6 w-full"
  >
    <AccessButton
      variant="entry"
      :text="entryButtonText"
      :disabled="isProcessing"
      @click="handleEntry"
    />
    <AccessButton variant="exit" :disabled="isProcessing" @click="handleExit" />

    <div
      v-if="resultMessage"
      class="w-full mb-4 px-4 py-3 rounded-lg text-sm font-semibold text-center shadow-md"
      style="
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        backdrop-filter: blur(4px);
      "
    >
      <div class="flex items-center gap-2 justify-center">
        <UiIcon :name="resultIcon" class="w-5 h-5" :class="resultIconClass" />
        <span>{{ resultMessage }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import UiIcon from "~/components/ui/Icon.vue";
import AccessButton from "~/mamatoia/components/buttons/AccessButton.vue";
import { ref, computed, onMounted } from "vue";
import type { TicketDataLike, ScanMode } from "./useTicketAccess";

const props = defineProps<{
  data: TicketDataLike | null;
  scanMode?: ScanMode;
  showAccessButtons: boolean;
  isProcessing: boolean;
  entryButtonText: string;
  entryButtonClass: string;
  resultMessage: string;
  resultIcon: string;
  resultIconClass: string;
}>();

const emit = defineEmits<{
  (e: "request-entry"): void;
  (e: "request-exit"): void;
  (e: "auto-entry"): void;
}>();

// Computed para detectar si es modo continuo
const isContinuousMode = computed(() => {
  try {
    const mode = props.scanMode as any;
    const modeStr = (mode && mode.value ? mode.value : mode) || "";
    return modeStr.toLowerCase().includes("continuo");
  } catch (e) {
    return false;
  }
});

// Este componente ahora es 100% presentacional + emisión de eventos.
// Todos los estados (processing, mensajes, textos) vienen del padre.

// Handlers solo emiten eventos al padre
const handleEntry = () => emit("request-entry");
const handleExit = () => emit("request-exit");

// Auto-acción para modo "continuo ingreso" (solo emite, el padre decide procesar)
onMounted(() => {
  try {
    const mode = props.scanMode as any;
    const modeStr = mode && mode.value ? mode.value : mode;
    if (modeStr === "continuo ingreso") emit("auto-entry");
  } catch (e) {
    console.warn("Error procesando modo continuo en Acciones (emisión):", e);
  }
});
</script>
