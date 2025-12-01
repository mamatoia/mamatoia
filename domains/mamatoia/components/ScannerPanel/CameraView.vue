<template>
  <div
    :class="cameraClass"
    class="relative bg-black min-h-[160px] md:min-h-[224px]"
    @click="$emit('tap')"
  >
    <video
      ref="videoEl"
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      playsinline
      muted
    ></video>
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div :class="['scan-window', scanWindowClass]" aria-hidden="true"></div>
    </div>
    <!-- Overlay slot for controls placed over the camera -->
    <!-- Prevent clicks inside the overlay from bubbling to the camera container
         (which emits 'tap' on click). This avoids showing "No hay código escaneado"
         when pressing control buttons like toggle camera size. -->
    <div class="absolute inset-0 z-50" @click.stop>
      <slot name="overlay"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineExpose, defineEmits } from "vue";

const emit = defineEmits(["tap", "camera-size-changed"]);

// SSR-safe: initialize with default and hydrate on client
const cameraSize = ref(0); // 0=grande,1=medio,2=cuadrado

const cameraClass = computed(() => "w-full h-40 md:h-56");
const scanWindowClass = computed(() => {
  if (cameraSize.value === 0) return "scan-window--large";
  if (cameraSize.value === 1) return "scan-window--medium";
  return "scan-window--small";
});

function toggleCameraSize() {
  if (cameraSize.value === 2) cameraSize.value = 0;
  else cameraSize.value++;
  // Guardar sólo en cliente
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem("cameraSize", String(cameraSize.value));
    } catch {}
  }
  emit("camera-size-changed", cameraSize.value);
}

// expose video element and toggler
const videoEl = ref(null);
defineExpose({ videoEl, toggleCameraSize, cameraSize });

onMounted(() => {
  // Leer preferencia de tamaño desde localStorage (cliente)
  try {
    const val =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("cameraSize")
        : null;
    const num = Number(val);
    cameraSize.value = isNaN(num) || num < 0 || num > 2 ? 0 : num;
  } catch {
    cameraSize.value = 0;
  }
  emit("camera-size-changed", cameraSize.value);
});
</script>

<style scoped>
video {
  background: #000;
}
.scan-window {
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.6);
  pointer-events: none;
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.6);
  transition: width 180ms ease, height 180ms ease, border-radius 120ms,
    transform 180ms ease;
  /* Keep scan window vertically centered by default (remove downward offset) */
  transform: translateY(0%);
}
.scan-window--large {
  width: 100%;
  height: 100%;
}
.scan-window--medium {
  width: 72%;
  height: 100%;
}
.scan-window--small {
  width: 40%;
  height: 100%;
  border-radius: 6px;
}
@media (max-width: 640px) {
  .scan-window {
    transform: translateY(0%);
  }
}
</style>
