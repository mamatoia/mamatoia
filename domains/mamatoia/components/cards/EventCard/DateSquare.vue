<template>
  <div
    class="flex flex-col items-center justify-center w-12 h-14 rounded-sm bg-base-200 text-center"
  >
    <div class="text-[14px] font-semibold text-base-content">
      {{ month }}
    </div>
    <div class="text-xl font-bold text-base-content leading-none">
      {{ day }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps({
  date: {
    type: Number,
    required: true,
  },
});

const TZ = "America/Argentina/Buenos_Aires";
const month = computed(() => {
  const date = new Date(props.date);
  return date
    .toLocaleString("es-AR", { month: "short", timeZone: TZ })
    .toLowerCase();
});
const day = computed(() => {
  const date = new Date(props.date);
  return date.toLocaleString("es-AR", { day: "numeric", timeZone: TZ });
});
</script>
