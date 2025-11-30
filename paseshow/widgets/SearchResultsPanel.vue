<template>
  <div class="overscroll-contain overflow-auto pl-4 pr-0">
    <!-- Loading inicial -->
    <div
      v-if="eventsStore.loading && events.length === 0"
      class="px-4 py-8 text-center"
    >
      <div class="loading loading-spinner loading-lg text-primary mb-4"></div>
      <p class="text-sm text-base-content/60">Cargando eventos...</p>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="filteredEvents.length === 0" class="px-4 py-8 text-center">
      <UiIcon
        name="outline:face-frown"
        class="w-12 h-12 mx-auto text-base-content/40 mb-4"
      />
      <h3 class="text-base font-semibold text-base-content/70 mb-2">
        Sin resultados
      </h3>
      <p class="text-sm text-base-content/50">
        No se encontraron eventos que coincidan con "{{ query }}"
      </p>
    </div>

    <!-- Resultados de b�squeda -->
    <div v-else>
      <!-- Header con contador -->
      <div class="px-4 py-3">
        <div class="text-sm text-base-content/70">
          {{ filteredEvents.length }} evento{{
            filteredEvents.length !== 1 ? "s" : ""
          }}
          encontrado{{ filteredEvents.length !== 1 ? "s" : "" }}
        </div>
      </div>

      <!-- Lista de eventos -->
      <ul class="list rounded-box bg-transparent mr-4">
        <li v-for="event in filteredEvents" :key="event.id">
          <NuxtLink :to="`/eventos/${event.id}`" class="bg-transparent">
            <EventItem
              :id="event.id"
              :eventName="event.name"
              :date="event.highlightedDate"
            />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useEventsStore } from "~/src/stores/paseshow/events";
import EventItem from "../components/items/EventItem.vue";
import UiIcon from "@/components/ui/Icon.vue";
import { normalizeEventDate } from "~/src/utils/dates";

// Props
const props = defineProps({
  query: {
    type: String,
    default: "",
  },
});

// Store
const eventsStore = useEventsStore();

// State
const events = ref([]);

// Computed
const filteredEvents = computed(() => {
  const q = props.query.toLowerCase().trim();
  if (!q) return events.value;

  return events.value.filter((event) => event.name.toLowerCase().includes(q));
});

// Funci�n para mapear eventos
const mapEvents = () => {
  events.value = eventsStore
    .eventsList()
    .map((item) => {
      const ts = normalizeEventDate(item);
      return {
        ...item,
        name: item.nombre || item.name,
        highlightedDate: ts,
      };
    })
    .sort((a, b) => {
      // Orden: m�s pr�ximos primero
      const ad = a.highlightedDate;
      const bd = b.highlightedDate;
      const aOk = typeof ad === "number" && !Number.isNaN(ad);
      const bOk = typeof bd === "number" && !Number.isNaN(bd);
      if (aOk && bOk) return ad - bd;
      if (aOk && !bOk) return -1;
      if (!aOk && bOk) return 1;
      return 0;
    });
};

// Cargar eventos
const ensureEventsLoaded = async () => {
  if (eventsStore.eventsList().length === 0) {
    await eventsStore.fetchAllEvents();
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await ensureEventsLoaded();
    mapEvents();
  } catch (error) {
    // En caso de error, mostrar mensaje en interfaz o manejar silenciosamente
    console.error("Error cargando eventos:", error);
  }
});
</script>
