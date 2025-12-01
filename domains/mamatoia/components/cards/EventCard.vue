<template>
  <DateSquare v-if="isValidDate" :date="date as number" />
  <EventTitle :text="eventName" />
  <div class="flex justify-end">
    <button
      class="btn btn-ghost bg-base-100 text-primary border-0 shadow-none outline-none focus:outline-none active:outline-none"
      @click.stop
    >
      <!-- Icono de favoritos (pestaña Todos) -->
      <SwapIcon
        v-if="showFavoriteIcon"
        v-model="favorite"
        iconOn="heroicons:heart-solid"
        iconOff="heroicons:heart"
        offClass="text-base-content/70"
        aria-label="toggle favorite"
      />
      <!-- Icono de selección (pestaña Favoritos) -->
      <SwapIcon
        v-else
        v-model="selected"
        iconOn="solid:check-circle"
        iconOff="outline:plus-circle"
        offClass="text-current"
        aria-label="toggle selection"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, watchEffect } from "vue";
import SwapIcon from "@/components/ui/SwapIcon.vue";
import DateSquare from "./EventCard/DateSquare.vue";
import EventTitle from "./EventCard/EventTitle.vue";
import { useFavoritesStore } from "~/src/stores/paseshow/favorites";
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
  id: {
    type: [String, Number],
    required: true,
  },
  filter: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  showFavoriteIcon: {
    type: Boolean,
    default: true,
  },
});

const isValidDate = computed(
  () => typeof props.date === "number" && !Number.isNaN(props.date)
);

const favorites = useFavoritesStore();
const selections = useSelectionsStore();

favorites.load();

const favorite = computed({
  get: () => favorites.isFavorite(props.id),
  set: (val: boolean) => favorites.setEvent(props.id, val),
});

// Variable reactiva para manejar la selección usando el store
// Para eventos en favoritos, necesitamos el contexto de evento actual desde la ruta
const route = useRoute();
const currentEventId = computed(() => {
  return (route.params as any)?.event || (route.params as any)?.id || props.id;
});

const selected = computed({
  get: () => selections.isEventSelected(props.id),
  set: () => {
    if (selections.isEventSelected(props.id)) {
      selections.unselectEvent(props.id);
    } else {
      selections.selectEvent(props.id);
    }
  },
});
</script>
