<template>
  <div class="px-4 pt-5 pb-5 relative">
    <!-- Slot para contenido adicional en la izquierda (ej: botón volver / drawer) -->
    <div v-if="$slots.left" class="absolute left-4 top-1/2 -translate-y-1/2">
      <slot name="left" />
    </div>

    <!-- Título centralizado -->
    <h1
      ref="titleRef"
      class="text-2xl font-semibold text-base-content text-center"
    >
      <span>{{ title }}</span>
    </h1>

    <!-- Botón de búsqueda (posicionado dinámicamente entre título y scanner) -->
    <div
      v-if="showSearch"
      ref="searchRef"
      class="absolute top-1/2 -translate-y-1/2 z-[60] pointer-events-auto"
      :style="searchStyle"
    >
      <SearchButton @click="$emit('search-click')" />
    </div>

    <!-- Scanner Button en la derecha -->
    <div
      v-if="showScanner"
      ref="scannerRef"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-[60] pointer-events-auto"
    >
      <ScannerButton />
    </div>

    <!-- Slot para acciones en la derecha (ej: menú de tres puntos) -->
    <div
      v-if="$slots.right"
      ref="rightSlotRef"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-50"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchButton from "./ui/buttons/SearchButton.vue";
import ScannerButton from "./ui/buttons/ScannerButton.vue";
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  showScanner: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["search-click"]);

// (UserMenu eliminado) AppHeader ahora solo expone slots y controles opcionales

// Refs for positioning the search button
const titleRef = ref<HTMLElement | null>(null);
const scannerRef = ref<HTMLElement | null>(null);
const rightSlotRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLElement | null>(null);
const searchStyle = ref<Record<string, string>>({});

const positionSearch = async () => {
  await nextTick();
  if (!props.showSearch) return;
  const titleEl = titleRef.value;
  const scanEl = scannerRef.value ?? rightSlotRef.value;
  const searchEl = searchRef.value;
  if (!searchEl || !titleEl) return;

  const titleRect = titleEl.getBoundingClientRect();
  // compute the title center X
  const titleCenterX = titleRect.left + titleRect.width / 2;

  // If scanner/slot not present, center search relative to title center
  if (!scanEl) {
    const left = titleCenterX - searchEl.offsetWidth / 2 + window.scrollX;
    searchStyle.value = { left: `${Math.max(8, left)}px` };
    return;
  }

  const scanRect = scanEl.getBoundingClientRect();
  // compute midpoint between title center and scanner left edge
  const midX = (titleCenterX + scanRect.left) / 2;
  let left = midX - searchEl.offsetWidth / 2 + window.scrollX;

  // Prevent overlap: enforce minimum gaps from title right and scanner left
  const minGap = 8;
  const minLeft = titleRect.right + minGap + window.scrollX; // at least after title right
  const maxLeft =
    scanRect.left - searchEl.offsetWidth - minGap + window.scrollX; // so it doesn't overlap scanner

  if (left < minLeft) left = minLeft;
  if (left > maxLeft) left = maxLeft;

  searchStyle.value = { left: `${Math.max(8, left)}px` };
};

const onResize = () => {
  positionSearch();
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  // position after mount
  positionSearch();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});
</script>
