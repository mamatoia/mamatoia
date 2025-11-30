<template>
  <div class="absolute right-2 top-2 z-10">
    <ActionDropdown
      label="Consultas"
      :actions="consultasActions"
      @action="handleAction"
    />
    <ConsultDNIModal ref="dniModal" />
    <ConsultaQRModal ref="qrModal" />
  </div>
</template>
<script setup lang="ts">
import ConsultDNIModal from "./ConsultDNIModal.vue";
import ConsultaQRModal from "./ConsultQRModal.vue";
import ActionDropdown from "../../components/ui/menu/ActionDropdown.vue";

const dniModal = ref<{ open: (opts?: any) => void } | null>(null);
const qrModal = ref<{ open: (opts?: any) => void } | null>(null);

// Configuración de acciones del dropdown
const consultasActions = [
  { key: "enter-dni", label: "Ingresar DNI" },
  { key: "enter-qr", label: "Ingresar QR" },
  // TODO: Agregar más acciones cuando estén implementadas
];

// Manejador centralizado de acciones
const handleAction = (actionKey: string, el?: EventTarget | null) => {
  switch (actionKey) {
    case "enter-dni":
      nextTick(() => {
        // Always open centered modal for DNI to keep consistent UX
        dniModal.value?.open();
      });
      break;
    case "enter-qr":
      nextTick(() => {
        // Always open centered modal for QR to keep consistent UX
        qrModal.value?.open();
      });
      break;
    default:
      console.warn(`Acción no implementada: ${actionKey}`);
  }
};
</script>
