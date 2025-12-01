<template>
  <button
    class="icon-btn p-3 md:p-2 rounded-full transition-colors"
    aria-label="Escáner"
    @click="openScanner"
  >
    <UiIcon
      name="heroicons:qr-code"
      class="w-7 h-7 md:w-6 md:h-6 pointer-events-none"
    />
  </button>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useSelectionsStore } from "~/src/stores/paseshow/selections";
import UiIcon from "~/components/ui/Icon.vue";

const router = useRouter();
const route = useRoute();
const selections = useSelectionsStore();

const openScanner = () => {
  const currentContext = getCurrentContext();

  if (currentContext.evento && currentContext.fecha) {
    router.push({
      path: "/escaner",
      query: currentContext,
    });
  } else {
    router.push("/escaner");
  }
};

const getCurrentContext = () => {
  const context: Record<string, string> = {};

  // PRIORIDAD 1: Selecciones del store (si están completas)
  const selectionContext = selections.getSelectionContext();

  if (selectionContext.hasSelections) {
    // Si hay un evento seleccionado, usarlo
    if (selectionContext.selectedEvents.length === 1) {
      context.evento = selectionContext.selectedEvents[0].toString();
    }

    // Si hay una fecha seleccionada, extraer el timestamp
    if (selectionContext.selectedDates.length === 1) {
      const dateId = selectionContext.selectedDates[0].toString();
      // Extraer timestamp de IDs como "date-1234567890"
      const timestamp = dateId.replace("date-", "");
      if (timestamp && !isNaN(Number(timestamp))) {
        context.fecha = timestamp;
      }
    }

    // Si hay un sector seleccionado, usarlo
    if (selectionContext.selectedSectors.length === 1) {
      const sectorId = selectionContext.selectedSectors[0].toString();
      // Extraer ID de sectores como "sector-abc" o usar directamente si es ID puro
      const cleanSectorId = sectorId.startsWith("sector-")
        ? sectorId.replace("sector-", "")
        : sectorId;
      context.sector = cleanSectorId;
    }
  }

  // PRIORIDAD 2: Route params (solo si no hay selecciones completas)
  if (!context.evento && route.params.event) {
    context.evento = route.params.event as string;
  }
  if (!context.fecha && route.params.date) {
    context.fecha = route.params.date as string;
  }
  if (!context.sector && route.params.sector) {
    context.sector = route.params.sector as string;
  }

  // PRIORIDAD 3: Query params (solo si faltan datos)
  if (!context.evento && route.query.evento) {
    context.evento = route.query.evento as string;
  }
  if (!context.fecha && route.query.fecha) {
    context.fecha = route.query.fecha as string;
  }
  if (!context.sector && route.query.sector) {
    context.sector = route.query.sector as string;
  }

  return context;
};
</script>
