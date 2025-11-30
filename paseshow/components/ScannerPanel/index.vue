<template>
  <div class="flex flex-col gap-4">
    <div class="rounded-lg overflow-hidden bg-base-200 relative">
      <CameraView
        ref="cameraRef"
        @tap="handleCameraTap"
        @camera-size-changed="uiCameraSize = $event"
      >
        <template #overlay>
          <ControlPanel
            :torch-on="torchOn"
            :beep-on="beepOn"
            :vibrate-on="vibrateOn"
            :camera-size="uiCameraSize"
            @toggle-torch="toggleTorch"
            @toggle-beep="toggleBeep"
            @toggle-vibrate="toggleVibrate"
            @toggle-camera-size="toggleCameraSize"
          />
        </template>
      </CameraView>
      <div class="p-2 text-xs opacity-70 flex items-center justify-between">
        <span>{{ cameraStatus }}</span>
        <button class="btn btn-xs" @click="toggleCamera">
          {{ isCameraRunning ? "Detener" : "Iniciar" }} cámara
        </button>
      </div>
      <ScanMessage
        :message="scanMessage"
        :color="messageColor"
        :show-button="locationsStore.lastQR?.length > 0"
        @clear="clearScan"
      />
    </div>

    <WedgeInput
      ref="wedgeInputRef"
      :prefix="PREFIX"
      :end-key="END_KEY"
      :gap-ms="HUMAN_GAP_MS"
      @code-ready="onScan"
      @error="onError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "#imports";
import { useAccessStore } from "~/src/stores/paseshow/access";

import CameraView from "./CameraView.vue";
import ControlPanel from "./ControlPanel.vue";
import ScanMessage from "./ScanMessage.vue";
import WedgeInput from "./WedgeInput.vue";

import { useCamera } from "./composables/useCamera";
import { useFeedback } from "./composables/useFeedback";
import { useScanDeduper } from "./composables/useScanDeduper";
import { consultarQR, registrarAcceso } from "./services/scanService";
import { useLocationsStore } from "~/src/stores/paseshow/locations";

function toggleCameraSize() {
  cameraRef.value?.toggleCameraSize?.();
}
// UI-only mirror of camera size for ControlPanel icon
const uiCameraSize = ref(0);

// UI states
const torchOn = ref(false);
const { beepOn, vibrateOn, toggleBeep, toggleVibrate, playBeep, doVibrate } =
  useFeedback();

const messageColor = ref("");

const route = useRoute();

// Camera handling
const cameraRef = ref(null);
const {
  isRunning: isCameraRunning,
  status: cameraStatus,
  bindVideo,
  start: startCamera,
  stop: stopCamera,
  toggle: toggleCamera,
  setTorch,
  resetProcessing,
} = useCamera({
  onScan,
  getRoiFactor: () =>
    uiCameraSize.value === 0 ? 1 : uiCameraSize.value === 1 ? 0.72 : 0.4,
});

function onError(error) {
  console.error("PaseshowWebViewScanner Error:", error);
  scanMessage.value = "Error al escanear";
  messageColor.value = "bg-error text-error-content";
}

function toggleTorch() {
  torchOn.value = !torchOn.value;
  setTorch(torchOn.value).then((ok) => {
    if (!ok) torchOn.value = false;
  });
}

// Scan state and deduper
const lastCode = ref("");
const scanMessage = ref("");
const {
  shouldProcess,
  clear: clearDuplicate,
  destroy: destroyDeduper,
} = useScanDeduper(10000); // 10 seconds window to prevent duplicate scans

// Stores
const locationsStore = useLocationsStore();
const accessStore = useAccessStore();

// Small map to track in-progress processing per normalized code to avoid
// concurrent or immediately repeated processing from multiple sources
const processingMap = {};
// Track registrarAcceso calls to avoid duplicate registrations for the same code
// within the deduper window.
const registrationsMap = {};
// Track when clearScan was called to enforce a brief pause before re-scanning same code
let lastClearTime = 0;
let lastClearedCode = "";

function clearScan() {
  const code = lastCode.value;
  if (code) clearDuplicate(code);
  // Track what code was cleared and when, to prevent immediate re-scan
  lastClearedCode = code ? String(code).trim().toLowerCase() : "";
  lastClearTime = Date.now();
  // Clear any ticket results shown in the TicketsPanel
  try {
    locationsStore.clear();
  } catch (e) {
    /* ignore */
  }
  // Hide the scan message when the user explicitly clears.
  scanMessage.value = "";
  messageColor.value = "";
  lastCode.value = "";
  // Limpiar mensaje de estado en el store
  locationsStore.setStatusMessage("", "");
  // Also allow re-registration immediately by clearing registrationsMap
  try {
    const key = code == null ? "" : String(code).trim().toLowerCase();
    if (key && registrationsMap[key]) delete registrationsMap[key];
  } catch (e) {
    /* ignore */
  }
  // Reset camera processing state to allow immediate re-scan
  try {
    if (resetProcessing) resetProcessing();
  } catch (e) {
    /* ignore */
  }
}

// Process scanned codes
async function onScan(code) {
  scanMessage.value = "Escaneando...";
  messageColor.value = "bg-base-300 text-base-content";

  const sectorEventoIdFromRoute = route.query?.sector?.toString();
  const allowedSectors = Array.isArray(accessStore.activeSectors)
    ? accessStore.activeSectors
    : [];
  const sectorEventoId = sectorEventoIdFromRoute || undefined;
  const qr = (code ?? "").toString().trim();

  // Normalize key for deduplication
  const key = qr.toLowerCase();

  if (!qr) {
    scanMessage.value = "Código QR vacío";
    messageColor.value = "bg-warning text-warning-content";
    return;
  }
  if (!sectorEventoId && (!allowedSectors || allowedSectors.length === 0)) {
    scanMessage.value =
      "Falta el parámetro 'sector' en la URL o no hay sectores activos";
    messageColor.value = "bg-warning text-warning-content";
    return;
  }

  // If user just cleared this exact code, enforce a 3s pause before accepting it again
  // This prevents immediate re-scan of the same ticket that's still in front of the camera/reader
  const timeSinceClear = Date.now() - lastClearTime;
  if (lastClearedCode === key && timeSinceClear < 3000) {
    console.log(
      "PaseshowWebViewScanner Ignoring re-scan of just-cleared code (wait 3s):",
      key
    );
    return;
  }

  // CRITICAL: Check deduper FIRST - this prevents same code within 10 seconds
  if (!shouldProcess(qr)) {
    console.log(
      "PaseshowWebViewScanner Duplicate scan ignored (within 10s window):",
      key
    );
    return;
  }

  // Now check if we're CURRENTLY processing this exact same code
  const now = Date.now();
  if (key && processingMap[key] && now - processingMap[key] < 1200) {
    console.log(
      "PaseshowWebViewScanner Already processing this code, ignoring:",
      key
    );
    return;
  }
  if (key) processingMap[key] = now;

  lastCode.value = qr;
  scanMessage.value = "Consultando...";
  messageColor.value = "bg-base-300 text-base-content";

  try {
    console.log("PaseshowWebViewScanner consultarQR params:", {
      qr,
      sectorEventoId,
    });
    const result = await consultarQR({ qr, sectorEventoId });

    if (Array.isArray(result) && result.length > 0) {
      const ticketData = result[0];

      // If we have an active sectors list, verify the ticket's sector is among them
      try {
        if (
          Array.isArray(allowedSectors) &&
          allowedSectors.length > 0 &&
          !accessStore.isSectorActive(
            ticketData?.sectorEventoId?.id?.toString()
          )
        ) {
          scanMessage.value =
            "Ticket NO corresponde a los sectores seleccionados";
          messageColor.value = "bg-warning text-warning-content";
          locationsStore.setStatusMessage(
            scanMessage.value,
            messageColor.value
          );
          return;
        }
      } catch (e) {
        /* ignore validation errors and proceed */
      }
      scanMessage.value =
        (ticketData?.mensaje || result.mensaje) ?? "Ticket encontrado";
      messageColor.value = "bg-success text-success-content";

      // Prevent duplicate registrarAcceso calls for the same normalized key
      try {
        const regKey = qr.toLowerCase();
        const nowReg = Date.now();
        if (
          registrationsMap[regKey] &&
          nowReg - registrationsMap[regKey] < 10000
        ) {
          // Already registered recently — show a gentle message and skip
          scanMessage.value = "Escaneo ya registrado recientemente";
          messageColor.value = "bg-warning text-warning-content";
        } else {
          registrationsMap[regKey] = Date.now();
          const registro = await registrarAcceso({
            qr,
            sectorEventoId,
            ticketData,
          });

          if (registro) {
            scanMessage.value = registro.mensaje || "Procesado";
            messageColor.value =
              registro.color || "bg-base-300 text-base-content";

            console.log("PaseshowWebViewScanner Registro exitoso:", {
              mensaje: scanMessage.value,
              color: messageColor.value,
              registro,
            });

            // Actualizar mensaje de estado en el store para mostrarlo en el ticket
            locationsStore.setStatusMessage(
              scanMessage.value,
              messageColor.value
            );

            // Registro exitoso - reproducir feedback
            if (registro.ok && registro.isValid !== false) {
              // Registro exitoso - reproducir feedback
              if (beepOn.value) playBeep();
              if (vibrateOn.value) doVibrate();
            }
          } else {
            scanMessage.value = "Error al registrar acceso";
            messageColor.value = "bg-error text-error-content";
            locationsStore.setStatusMessage(
              scanMessage.value,
              messageColor.value
            );
          }
        }
      } catch (e) {
        console.error("PaseshowWebViewScanner Error en registrarAcceso:", e);
        scanMessage.value = "Error al registrar acceso";
        messageColor.value = "bg-error text-error-content";
      }
    } else {
      scanMessage.value = result?.mensaje || "No se encontró resultado";
      messageColor.value = "bg-warning text-warning-content";
    }
  } catch (err) {
    console.error("PaseshowWebViewScanner Error consultando QR:", err);
    scanMessage.value = `Error consultando QR: ${err?.message || err}`;
    messageColor.value = "bg-error text-error-content";
  } finally {
    // clear local processing guard for this code so it can be retried later
    try {
      if (key && processingMap[key]) delete processingMap[key];
    } catch (e) {
      /* ignore */
    }
  }

  // Fallback: if the locations store contains results but no message was set,
  // ensure the user sees a brief confirmation and the 'Limpiar' button.
  try {
    if (
      (!scanMessage.value || scanMessage.value === "") &&
      Array.isArray(locationsStore.lastQR) &&
      locationsStore.lastQR.length > 0
    ) {
      scanMessage.value = "Ticket encontrado";
      messageColor.value = "bg-success text-success-content";
    }
  } catch (e) {
    /* ignore */
  }
}

// Tap on camera to manually re-check the last code
async function handleCameraTap() {
  if (!lastCode.value) {
    scanMessage.value = "No hay código escaneado";
    messageColor.value = "bg-warning text-warning-content";
    return;
  }
  scanMessage.value = "Consultando...";
  messageColor.value = "bg-base-300 text-base-content";
  try {
    const sectorEventoId = route.query?.sector?.toString();
    const result = await consultarQR({ qr: lastCode.value, sectorEventoId });
    if (Array.isArray(result) && result.length > 0) {
      scanMessage.value =
        (result[0]?.mensaje || result.mensaje) ?? "Ticket encontrado";
      messageColor.value = "bg-success text-success-content";
    } else {
      scanMessage.value = result?.mensaje || "No se encontró resultado";
      messageColor.value = "bg-warning text-warning-content";
    }
  } catch (e) {
    scanMessage.value = "Error al consultar";
    messageColor.value = "bg-error text-error-content";
  }
}

onMounted(async () => {
  await nextTick();
  const el = cameraRef.value?.videoEl;
  if (el) bindVideo(el);
  startCamera();
});

onBeforeUnmount(() => {
  stopCamera();
  destroyDeduper();
});

// WedgeInput constants
const PREFIX = "";
const END_KEY = "Enter";
const HUMAN_GAP_MS = 80;
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes visual-vibrate {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px) rotate(-0.5deg);
  }
  40% {
    transform: translateX(6px) rotate(0.5deg);
  }
  60% {
    transform: translateX(-4px) rotate(-0.3deg);
  }
  80% {
    transform: translateX(4px) rotate(0.3deg);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
