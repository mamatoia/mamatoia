<template>
  <div class="overscroll-contain overflow-auto pl-3 pr-0">
    <!-- Estado de carga -->
    <div v-if="loading" class="p-4 text-left opacity-70">
      Cargando sectores…
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="p-4 text-left text-error">{{ error }}</div>

    <!-- Lista de sectores -->
    <ul v-else-if="sectors.length" class="list bg-base-100 rounded-box">
      <li
        class="pl-2 pr-5 pt-4 pb-2 text-sm opacity-80 tracking-wide relative text-left"
      >
        <button
          v-if="selectedCount > 0"
          @click="clearSelections"
          class="absolute -top-2 right-4 btn btn-xs btn-ghost text-white hover:text-white/80 z-10"
        >
          Limpiar ({{ selectedCount }})
        </button>
        <div class="flex justify-between">
          <span>Cantidad de Sectores: {{ sectors.length }}</span>
          <span class="text-accent font-medium">
            Seleccionados: {{ selectedCount }}
          </span>
        </div>
      </li>
      <li v-for="(sector, index) in sectors" :key="sectorKey(sector, index)">
        <NuxtLink :to="generateSectorLink(sector, index)">
          <SectorItem
            :name="sector.name"
            :capacity="sector.capacity"
            :sectorId="sector.sectorEventoId || sector.id || sector.name"
          />
        </NuxtLink>
      </li>
    </ul>

    <!-- Vacío -->
    <div v-else class="p-4 text-center text-base-content opacity-60">
      No hay sectores para este evento.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useEventsStore } from "~/src/stores/paseshow/events";
import { useSelectionsStore } from "~/src/stores/paseshow/selections";
import { generateScannerUrl } from "~/src/utils/scanner";
import SectorItem from "../components/items/SectorItem.vue";

const route = useRoute();
const eventsStore = useEventsStore();
const selectionsStore = useSelectionsStore();
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// Soportar eventId desde params anidados (event) o id o query
const eventId = computed(() => {
  const ev = (route.params as any)?.event as string | undefined;
  const p = (route.params as any)?.id as string | undefined;
  const q = route.query?.eventId as string | undefined;
  return (ev || p || q || "").toString();
});

// Optional: filtrar por fechaFuncion; usar param anidado [date] si está
const selectedDateTs = computed(() => {
  const p = (route.params as any)?.date as string | undefined;
  const q = route.query?.date as string | undefined;
  const raw = p || q;
  return raw ? Number(raw) : undefined;
});

// Contador de sectores seleccionados
const selectedCount = computed(() => {
  return selectionsStore.selectedSectorsCount;
});

// Función para limpiar selecciones
const clearSelections = () => {
  selectionsStore.clearSectorSelections();
};

// Función para generar el enlace del sector (usando escáner limpio)
const generateSectorLink = (sector: any, index: number) => {
  const sectorId = sector.sectorEventoId || sector.id || index;
  const fechaFuncion = selectedDateTs.value || sector.fechaFuncion;

  return generateScannerUrl(
    eventId.value,
    String(fechaFuncion),
    String(sectorId)
  );
};

// Deduplcar por nombre y leer siempre desde el store para mantener reactividad
const sectors = computed(() => {
  const selector =
    selectedDateTs.value && Number.isFinite(selectedDateTs.value)
      ? selectedDateTs.value
      : eventId.value;
  const list = eventsStore.sectorsList(selector as any) || [];
  const seen = new Set<string>();
  const deduped = [] as any[];
  for (const s of list) {
    const key = (s?.name || "").toString().trim().toLowerCase();
    if (!key) continue;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(s);
    }
  }
  return deduped;
});

const sectorKey = (sector: any, index: number) =>
  (sector?.name && String(sector.name)) || `sector-${index}`;

const load = async () => {
  error.value = null;
  if (!eventId.value) {
    console.warn("SectorsPanel: falta eventId (query o params)");
    return;
  }
  loading.value = true;
  try {
    await eventsStore.fetchEvent(eventId.value);
  } catch (e: any) {
    console.error("Failed to fetch event for sectors:", e);
    error.value = e?.message || "No se pudieron cargar los sectores.";
  } finally {
    loading.value = false;
  }
};

onMounted(load);

// Solo recargar si cambia el eventId (no por cambio de fecha)
watch(eventId, async (next, prev) => {
  if (next && next !== prev) {
    await load();
  }
});
</script>
