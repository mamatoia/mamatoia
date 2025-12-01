<template>
  <div class="flex flex-col pl-2">
    <div class="flex-row">
      <span class="text-xl font-semibold">
        {{ weekDayShort }}, {{ dayNumber }} {{ monthShort }}
      </span>
      <span class="text-lg font-semibold"> • {{ hourMinute }} </span>
    </div>
    <div class="text-sm text-base-content mt-1">
      Sectores: {{ sectorCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSectorsStore } from "~/src/stores/paseshow/sectors";
const props = defineProps<{ date: number }>();

const TZ = "America/Argentina/Buenos_Aires";
const weekDayShort = computed(() =>
  new Date(props.date)
    .toLocaleString("es-AR", { weekday: "short", timeZone: TZ })
    .toLowerCase()
);

const monthShort = computed(() =>
  new Date(props.date)
    .toLocaleString("es-AR", { month: "short", timeZone: TZ })
    .toLowerCase()
);

const dayNumber = computed(() =>
  new Date(props.date).toLocaleString("es-AR", { day: "numeric", timeZone: TZ })
);

const hourMinute = computed(() =>
  new Date(props.date).toLocaleString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  })
);

// Cantidad de sectores asociados a esta fechaFuncion
const sectorsStore = useSectorsStore();
const sectorCount = computed(() => {
  const list = sectorsStore.byFecha(props.date) || [];
  return Array.isArray(list) ? list.length : 0;
});
</script>
