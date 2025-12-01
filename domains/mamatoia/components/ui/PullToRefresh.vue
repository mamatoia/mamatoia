<template>
  <!-- Indicador anclado al top del contenedor con scroll -->
  <div ref="rootEl" class="absolute top-0 left-0 right-0 h-0 overflow-visible">
    <div v-show="visible" class="w-full overflow-visible pointer-events-none">
      <div
        :class="[
          'absolute top-0 left-0 right-0 flex items-center justify-center z-10',
          isDragging ? 'transition-none' : 'transition-transform duration-200',
        ]"
        :style="{
          transform: isRefreshing
            ? 'translateY(0px)'
            : `translateY(${pullOffset}px)`,
        }"
      >
        <!-- Cápsula visual del indicador -->
        <div
          class="px-3 py-2 rounded-full bg-base-100/80 backdrop-blur flex items-center gap-2"
        >
          <!-- Indicador de loading simple -->
          <div
            v-if="pullOffset > 0 || isRefreshing"
            class="bg-primary rounded-full w-10 h-10 flex items-center justify-center"
            :class="whiteIcons ? 'text-white' : 'text-primary'"
          >
            <UiIcon
              name="solid:arrow-path"
              :class="[
                'w-6 h-6 p-0',
                isRefreshing
                  ? 'animate-spin'
                  : isDragging
                  ? 'transition-none'
                  : 'transition-transform duration-200',
              ]"
              :style="
                isRefreshing ? {} : { transform: `rotate(${rotationDeg}deg)` }
              "
            />
          </div>

          <!-- Progreso numérico opcional para depurar -->
          <span
            v-if="debug"
            class="text-xs"
            :class="whiteIcons ? 'text-white' : 'text-primary'"
          >
            {{ Math.round(progress * 100) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

// Props y eventos
const props = defineProps({
  maxPull: { type: Number, default: 100 },
  threshold: { type: Number, default: 60 },
  whiteIcons: { type: Boolean, default: false },
  debug: { type: Boolean, default: false },
  // Permite forzar un selector específico para el contenedor con scroll
  // Si no se provee, se detecta el ancestro scrollable automáticamente
  targetSelector: { type: String, default: "" },
  // Grados totales de rotación cuando se llega al límite de arrastre (maxPull)
  rotationDegrees: { type: Number, default: 360 },
  // Factor de easing (1 = lineal). Valores <1 hacen que avance más lento al principio
  rotationEase: { type: Number, default: 0.75 },
});

const emit = defineEmits(["pulling", "release", "refresh"]);

// Refs de estado visual
const rootEl = ref(null);
const pullOffset = ref(0);
const isDragging = ref(false);
const thresholdReached = ref(false);
const atTop = ref(true);
const isRefreshing = ref(false);
const LOADING_DURATION = 700; // ms que se mantiene girando tras soltar
let scrollEl = null;
let target = null;
let startY = 0;
let startedAtTop = false;

const passiveTrue = { passive: true };
const passiveFalse = { passive: false };

// Definimos handlers en el scope de setup para que `onBeforeUnmount` pueda eliminarlos.
const onTouchStart = (e) => {
  if (!e.touches || e.touches.length !== 1) return;
  updateAtTop();
  startedAtTop = atTop.value;
  if (!startedAtTop) return; // solo iniciamos si está arriba
  startY = e.touches[0].clientY;
};

const onTouchMove = (e) => {
  if (!isDragging.value && !atTop.value) return;
  if (!e.touches || e.touches.length !== 1) return;

  const currentY = e.touches[0].clientY;
  const deltaY = currentY - startY;

  // Solo interceptamos cuando se quiere bajar y estamos arriba
  if (deltaY > 0 && (isDragging.value || startedAtTop)) {
    // Evitar el bounce del navegador (solo si el evento es cancelable)
    if (e.cancelable) e.preventDefault();
    const next = dampedOffset(deltaY, props.maxPull);
    pullOffset.value = next;
    thresholdReached.value = next >= props.threshold;
    emit("pulling", {
      offset: next,
      progress: progress.value,
      thresholdReached: thresholdReached.value,
    });
    if (!isDragging.value) isDragging.value = true; // por si comenzó a mitad del movimiento
  } else {
    // Si el usuario vuelve hacia arriba durante el gesto, reducimos hasta 0 pero mantenemos el estado de arrastre
    if (isDragging.value) {
      pullOffset.value = 0;
      thresholdReached.value = false;
      emit("pulling", {
        offset: 0,
        progress: 0,
        thresholdReached: false,
      });
    }
  }
};

const resetVisual = () => {
  // El wrapper ya tiene transition; mantenemos 0 para animar hacia arriba.
  pullOffset.value = 0;
  thresholdReached.value = false;
};

const onTouchEnd = () => {
  if (!isDragging.value) return;
  emit("release", {
    offset: pullOffset.value,
    progress: progress.value,
    thresholdReached: thresholdReached.value,
  });
  // Marcamos fin de gesto
  isDragging.value = false;
  // Si se alcanzó el umbral disparamos refresh y animación de loading
  if (thresholdReached.value) {
    emit("refresh");
    isRefreshing.value = true;
    // Reset visual para animar subida y mantener spinner un tiempo
    resetVisual();
    setTimeout(() => {
      isRefreshing.value = false;
    }, LOADING_DURATION);
  } else {
    resetVisual();
  }
};

const onScroll = () => updateAtTop();

// Registrar limpieza de listeners durante setup (antes de cualquier await)
onBeforeUnmount(() => {
  if (!target) return;
  try {
    target.removeEventListener("scroll", onScroll, passiveTrue);
    target.removeEventListener("touchstart", onTouchStart, passiveTrue);
    target.removeEventListener("touchmove", onTouchMove, passiveFalse);
    target.removeEventListener("touchend", onTouchEnd, passiveTrue);
  } catch (e) {
    // fallthrough
  }
});

const progress = computed(() => {
  // Progreso 0..1 relativo al umbral
  return Math.min(1, pullOffset.value / props.threshold);
});

const visible = computed(
  () =>
    atTop.value ||
    isDragging.value ||
    pullOffset.value > 0 ||
    isRefreshing.value
);

// Progreso de rotación basado en la distancia real vs maxPull (no vs threshold para que tarde más)
const rotationProgressRaw = computed(() =>
  Math.min(1, pullOffset.value / props.maxPull)
);
// Aplicamos un easing exponencial suave para que al principio rote menos y acelere luego
const rotationProgress = computed(() =>
  Math.pow(rotationProgressRaw.value, props.rotationEase)
);
// Rotación final
const rotationDeg = computed(() =>
  Math.round(rotationProgress.value * props.rotationDegrees)
);

// Utilidad: detectar el ancestro scrollable
function getScrollParent(el) {
  if (!el) return window;
  const overflowScrollReg = /(auto|scroll|overlay)/;
  let parent = el.parentElement;
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowScrollReg.test(overflowY)) return parent;
    parent = parent.parentElement;
  }
  return window;
}

function updateAtTop() {
  if (!scrollEl) return;
  if (scrollEl === window) {
    atTop.value =
      (window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0) <= 0;
  } else {
    atTop.value = scrollEl.scrollTop <= 0;
  }
}

// Función de amortiguación para que la tracción se sienta natural
function dampedOffset(deltaY, maxPull) {
  if (deltaY <= 0) return 0;
  // Curva de amortiguación suave (acerca rápidamente y satura)
  const k = 40; // cuanto menor, más sensible
  const v = 1 - Math.pow(0.5, deltaY / k);
  return Math.min(maxPull, v * maxPull);
}

onMounted(async () => {
  await nextTick();
  // Determinar contenedor de scroll
  scrollEl = props.targetSelector
    ? document.querySelector(props.targetSelector)
    : getScrollParent(rootEl.value);

  // Asegurar posicionamiento relativo del contenedor si no lo tiene, para anclar absoluto correctamente
  if (rootEl.value && rootEl.value.parentElement) {
    const p = rootEl.value.parentElement;
    const style = window.getComputedStyle(p);
    if (style.position === "static") {
      p.style.position = "relative";
    }
  }

  updateAtTop();

  // Añadir listeners al target determinado
  target = scrollEl || window;
  target.addEventListener("scroll", onScroll, passiveTrue);
  target.addEventListener("touchstart", onTouchStart, passiveTrue);
  target.addEventListener("touchmove", onTouchMove, passiveFalse);
  target.addEventListener("touchend", onTouchEnd, passiveTrue);
});
</script>
