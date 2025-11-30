<template>
  <div class="overscroll-contain overflow-auto pl-3 pr-0">
    <ul class="list bg-base-100 rounded-box">
      <li
        class="pl-2 pr-5 pt-4 pb-2 text-sm opacity-80 tracking-wide relative text-left"
      >
        <button
          v-if="selectedCount > 0"
          @click="clearSelections"
          class="absolute -top-2 right-2 btn btn-xs btn-ghost text-white hover:text-white/80 z-10"
        >
          Limpiar ({{ selectedCount }})
        </button>
        <div class="flex justify-between">
          <span>Cantidad de Fechas: {{ events.length }}</span>
          <span class="text-secondary font-medium">
            Seleccionadas: {{ selectedCount }}
          </span>
        </div>
      </li>
      <li v-for="(event, index) in events" :key="index">
        <NuxtLink
          :to="{
            path: `/eventos/${route.params.event || route.params.id}/${
              event.fechaFuncion
            }`,
          }"
        >
          <DateItem :eventName="event.name" :date="event.highlightedDate" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useEventsStore } from "~/src/stores/paseshow/events";
import { useSelectionsStore } from "~/src/stores/paseshow/selections";

import DateItem from "../components/items/DateItem.vue";
import { normalizeEventDate, dayKeyAR } from "~/src/utils/dates";

const eventsStore = useEventsStore();
const selectionsStore = useSelectionsStore();
const events = ref<any[]>([]);
const route = useRoute();

const selectedCount = computed(() => {
  return selectionsStore.selectedDatesCount;
});

const clearSelections = () => {
  selectionsStore.clearAllSelections();
};

onMounted(async () => {
  const eventId =
    ((route.params as any).event as string) ||
    ((route.params as any).id as string);
  if (!eventId) {
    console.warn("DatesPanel: missing eventId in route params; skipping fetch");
    return;
  }
  // Fetch dates for the event
  await eventsStore.fetchEvent(eventId);

  const raw: any[] = (eventsStore.datesList(eventId) as any[]) || [];

  // Mostrar cada fechaFuncion (no agrupar por día) para respetar funciones/horarios distintos
  events.value = (raw || [])
    .filter(
      (it: any) => it && (it.fechaFuncion || it.fecha || it.fechaDestacado)
    )
    .map((it: any) => ({
      ...it,
      name:
        it.eventoNombre ||
        it.nombreEvento ||
        it.nombre ||
        it.descripcion ||
        "Fecha",
      highlightedDate: normalizeEventDate(it),
      fechaFuncion: Number(it.fechaFuncion ?? 0),
    }));
});
</script>
