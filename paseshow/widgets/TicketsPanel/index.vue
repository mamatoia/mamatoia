<template>
  <TicketContainer>
    <TicketCard
      v-for="(ticket, index) in resultados"
      :key="ticket.id ?? ticket.reservaId?.id ?? `dni-${index}`"
      :data="ticket"
      type="dynamic"
      :showAccessButtons="showAccessButtons"
      :scanMode="effectiveScanType"
      :statusMessage="index === 0 ? lastStatusMessage : ''"
      :statusColor="index === 0 ? lastStatusColor : ''"
    />

    <Mensajes
      :has-q-r="hasQR"
      :has-d-n-i="hasDNI"
      :has-searched-q-r="hasSearchedQR"
      :has-searched-d-n-i="hasSearchedDNI"
      :error-q-r="errorQR"
      :last-q-r-code="lastQRCode"
      :last-q-r-at="lastQRAt"
      :last-q-r-time="lastQRTime"
    />
  </TicketContainer>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, nextTick } from "vue";
import TicketContainer from "../../containers/TicketContainer.vue";
import TicketCard from "../../components/cards/TicketCard/index.vue";

import { useAccessStore } from "~/src/stores/paseshow/access";
import { useLocationsStore } from "../../../src/stores/paseshow/locations";
import { useAccessConfig } from "~/src/composables/useAccessConfig";
import { useGeneralSettingsStore } from "~/src/stores/paseshow/generalSettings";
import Mensajes from "./Mensajes.vue";

// Acceso al store para obtener los resultados
const locationsStore = useLocationsStore();

// Configuración de acceso
const { initializeAccess } = useAccessConfig();

// Computed properties para los resultados
const qrResults = computed(() => locationsStore.qrResults);
const dniResults = computed(() => locationsStore.dniResults);

const resultados = computed(() => {
  // Combinar resultados de QR y DNI
  return [...qrResults.value, ...dniResults.value];
});

// Flags
const hasQR = computed(() => qrResults.value.length > 0);
const hasDNI = computed(() => dniResults.value.length > 0);
const hasSearchedQR = computed(
  () => locationsStore.qrVersion > 0 || !!locationsStore.errorQR
);
const hasSearchedDNI = computed(
  () =>
    (locationsStore.lastDNI && locationsStore.lastDNI.length > 0) ||
    !!locationsStore.errorDNI
);

// Último QR y hora
const lastQRCode = computed(() => locationsStore.lastQRCode || "");
const lastQRAt = computed(() => locationsStore.lastQRAt || 0);
const lastQRTime = computed(() =>
  lastQRAt.value ? new Date(lastQRAt.value).toLocaleTimeString() : ""
);
const errorQR = computed(() => locationsStore.errorQR || "");

// Mensaje de estado del último registro
const lastStatusMessage = computed(
  () => locationsStore.lastStatusMessage || ""
);
const lastStatusColor = computed(() => locationsStore.lastStatusColor || "");

// Access store: determine if we should show the entry/exit buttons
const accessStore = useAccessStore();
// Also consider the global general settings: the GUI that sets the scan mode
// writes into `generalSettings.tipoDeEscaneo`. Use that as authoritative when
// present so changing the setting in the General panel takes immediate effect.
const generalSettings = useGeneralSettingsStore();
const effectiveScanType = computed(
  () => generalSettings.tipoDeEscaneo || accessStore.scanType
);
const showAccessButtons = computed(() => {
  // Hide the manual buttons for any continuous mode (ingreso, salida, or both)
  return !effectiveScanType.value?.startsWith?.("continuo");
});

// Inicializar configuración de acceso al montar
onMounted(() => {
  initializeAccess();
});

// Limpiar resultados cuando salimos de la página del escáner
onBeforeUnmount(() => {
  locationsStore.clear();
});
</script>
