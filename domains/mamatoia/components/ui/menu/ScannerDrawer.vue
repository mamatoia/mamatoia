<template>
  <DrawerMenu :toggle-id="toggleId" :side="side" @logout="emitLogout">
    <template #content>
      <slot />
    </template>

    <template #side>
      <div
        class="w-80 min-h-screen h-screen bg-base-300 flex flex-col text-base"
      >
        <ul class="menu flex-1 overflow-y-auto p-4 space-y-3">
          <li>
            <button
              type="button"
              class="w-full text-left py-2 text-base block"
              @click="openScanModal"
            >
              <div>Tipo de escaneo:</div>
              <div class="text-sm capitalize">{{ scanType }}</div>
            </button>
            <span class="hidden">
              <FieldSelectModal
                ref="scanModal"
                v-model="scanType"
                label="Tipo de Escaneo"
                :options="scanOptions"
                label-class="text-base text-base-100"
                modal-title="Seleccionar tipo de escaneo"
                modal-width="w-80"
                trigger-class="text-[17px] font-normal bg-base-300 text-base-100 border-base-300"
                :show-trigger="false"
                :show-label="false"
                :compact="true"
              />
            </span>
            <span class="hidden">
              <ConsultDNIModal ref="dniModal" />
            </span>
          </li>

          <li>
            <button
              type="button"
              class="w-full text-left py-2 text-base"
              @click="enterDni"
            >
              Ingresar DNI
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex items-center justify-between py-2 text-base"
              @click="decreaseCounter"
            >
              <span>Contador -</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex items-center justify-between py-2 text-base"
              @click="increaseCounter"
            >
              <span>Contador +</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              class="w-full text-left py-2 text-base"
              @click="onLogout"
            >
              Salir
            </button>
          </li>
        </ul>
      </div>
    </template>
  </DrawerMenu>
</template>

<script setup lang="ts">
import DrawerMenu from "./DrawerMenu.vue";
import FieldSelectModal from "@/components/fields/FieldSelectModal.vue";
import ConsultDNIModal from "~/mamatoia/widgets/locations/ConsultDNIModal.vue";
import { nextTick } from "vue";
import { ref, watch, type PropType, onMounted } from "vue";
import { useAuthStore } from "~/src/stores/auth";
import { useAccessStore } from "~/src/stores/paseshow/access";
import { useGeneralSettingsStore } from "~/src/stores/paseshow/generalSettings";

const props = defineProps({
  toggleId: { type: String, default: "scanner-drawer" },
  side: { type: String as PropType<"start" | "end">, default: "end" },
});
const emit = defineEmits<{ (e: "logout"): void }>();

const scanType = ref("continuo ingreso");
const access = useAccessStore();
const generalSettings = useGeneralSettingsStore();
const lastDni = ref("");
const counter = ref(0);

const scanOptions = [
  { value: "continuo ingreso", label: "Continuo Ingreso" },
  { value: "continuo salida", label: "Continuo Salida" },
  { value: "preguntar", label: "Preguntar" },
  { value: "continuo ingreso y salida", label: "Continuo Ingreso Y Salida" },
];

const auth = useAuthStore();

const scanModal = ref<{ open?: () => void } | null>(null);
const dniModal = ref<{ open?: (opts?: any) => void } | null>(null);

// Initialize scanType from stores (persisted) on mount
onMounted(() => {
  // Load persisted general settings first (if any)
  try {
    generalSettings.loadFromStorage();
  } catch {}

  // Prefer generalSettings persisted value, then access store, then default
  const gs = generalSettings.tipoDeEscaneo || access.scanType || scanType.value;
  scanType.value = gs as string;
  // sync stores
  access.setScanType(scanType.value);
  generalSettings.tipoDeEscaneo = scanType.value;
  generalSettings.saveToStorage();
});

const openScanModal = () => {
  if (scanModal.value?.open) scanModal.value.open();
};

const decreaseCounter = () => {
  counter.value = Math.max(0, counter.value - 1);
  closeDrawer();
};
const increaseCounter = () => {
  counter.value = counter.value + 1;
  closeDrawer();
};

const changeScanType = (val?: string) => {
  // Not used here; selection happens inside FieldSelectModal
};

const enterDni = () => {
  // Open the shared ConsultDNIModal (centered) without closing the drawer
  nextTick(() => {
    const fn = dniModal.value?.open;
    if (fn) fn();
  });
};

const closeDrawer = () => {
  const el = document.getElementById(props.toggleId) as HTMLInputElement | null;
  if (el) el.checked = false;
};

watch(scanType, (newVal, oldVal) => {
  if (oldVal !== undefined && newVal !== oldVal) closeDrawer();
});

// Sync scanType to global stores when it changes
watch(scanType, (newVal) => {
  if (!newVal) return;
  access.setScanType(newVal);
  generalSettings.tipoDeEscaneo = newVal;
  // persist settings
  try {
    generalSettings.saveToStorage();
  } catch (e) {
    // ignore
  }
});

// Keep local scanType in sync when other parts of the app update the stores
watch(
  () => generalSettings.tipoDeEscaneo,
  (val) => {
    if (val && val !== scanType.value) {
      scanType.value = val as string;
      access.setScanType(val as string);
    }
  }
);

watch(
  () => access.scanType,
  (val) => {
    if (val && val !== scanType.value) {
      scanType.value = val as string;
      generalSettings.tipoDeEscaneo = val as string;
      try {
        generalSettings.saveToStorage();
      } catch {}
    }
  }
);

const onLogout = async () => {
  try {
    await auth.logout?.();
  } finally {
    emit("logout");
  }
};

const emitLogout = () => emit("logout");
</script>
