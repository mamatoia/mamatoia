<template>
  <div class="flex flex-col flex-1 pl-2">
    <span class="text-xl font-semibold">{{ name }}</span>
    <span class="text-sm text-base-content mt-1"
      >Capacidad: {{ capacity }}</span
    >
  </div>
  <div class="flex justify-end">
    <button
      class="btn btn-ghost bg-base-100 text-accent border-0 shadow-none outline-none focus:outline-none active:outline-none"
      @click.stop.prevent="toggleSelection"
    >
      <SwapIcon
        iconOn="solid:check-circle"
        iconOff="outline:plus-circle"
        offClass="text-current"
        :modelValue="isSelected"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { useRoute } from "vue-router";
import SwapIcon from "@/components/ui/SwapIcon.vue";
import { useSelectionsStore } from "~/src/stores/paseshow/selections";

const props = defineProps({
  name: { type: String, required: true },
  capacity: { type: Number, required: false },
  sectorId: { type: String, required: false },
});

const route = useRoute();
const selectionsStore = useSelectionsStore();

const eventId = computed(() => {
  return (route.params as any)?.event || (route.params as any)?.id || "";
});

const dateId = computed(() => {
  const dateParam = (route.params as any)?.date;
  return dateParam ? `date-${dateParam}` : "";
});

const sectorIdentifier = computed(() => {
  // Crear ID único para el sector
  return props.sectorId || `sector-${props.name}`;
});

const isSelected = computed(() => {
  return eventId.value && dateId.value && sectorIdentifier.value
    ? selectionsStore.isSectorSelected(
        eventId.value,
        dateId.value,
        sectorIdentifier.value
      )
    : false;
});

const toggleSelection = () => {
  if (!eventId.value || !dateId.value || !sectorIdentifier.value) return;
  selectionsStore.toggleSectorSelection(
    eventId.value,
    dateId.value,
    sectorIdentifier.value
  );
};
</script>
