<template>
  <div class="flex flex-col flex-1">
    <EventDayInfo v-if="isValidDate" :date="date as number" />
  </div>
  <div class="flex justify-end">
    <button
      class="btn btn-ghost bg-base-100 text-secondary border-0 shadow-none outline-none focus:outline-none active:outline-none"
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
import EventDayInfo from "./EventDayInfo.vue";
import { useSelectionsStore } from "~/src/stores/paseshow/selections";

const props = defineProps({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: false,
    default: undefined,
  },
});

const route = useRoute();
const selectionsStore = useSelectionsStore();

const isValidDate = computed(
  () => typeof props.date === "number" && !Number.isNaN(props.date)
);

const eventId = computed(() => {
  return (route.params as any)?.event || (route.params as any)?.id || "";
});

// Crear ID único para la fecha basado en el timestamp
const dateId = computed(() => {
  return isValidDate.value && props.date !== undefined
    ? `date-${props.date}`
    : "";
});

const isSelected = computed(() => {
  return eventId.value && dateId.value
    ? selectionsStore.isDateSelected(eventId.value, dateId.value)
    : false;
});

const toggleSelection = () => {
  if (!eventId.value || !dateId.value) return;

  if (isSelected.value) {
    selectionsStore.unselectDate(eventId.value, dateId.value);
  } else {
    selectionsStore.selectDate(eventId.value, dateId.value);
  }
};
</script>
