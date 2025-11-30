<template>
  <div v-if="!favoritesOnly" class="overscroll-contain pl-4 pr-0">
    <ul class="list rounded-box bg-transparent">
      <li v-for="(event, index) in filtered" :key="index">
        <NuxtLink :to="`/eventos/${event.id}`" class="bg-transparent">
          <EventItem
            :id="event.id"
            :eventName="event.name"
            :date="event.highlightedDate"
            :show-favorite-icon="!favoritesOnly"
          />
        </NuxtLink>
      </li>
    </ul>
  </div>

  <div v-else class="overscroll-contain pl-4 pr-0">
    <div
      v-if="filtered.length === 0"
      class="px-4 py-6 text-sm text-base-content/70"
    >
      No hay favoritos todavía.
    </div>
    <ul class="list rounded-box bg-transparent">
      <li v-for="(event, index) in filtered" :key="index">
        <NuxtLink :to="`/eventos/${event.id}`" class="bg-transparent">
          <EventItem
            :id="event.id"
            :eventName="event.name"
            :date="event.highlightedDate"
            :show-favorite-icon="false"
          />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useEventsStore } from "~/src/stores/paseshow/events";
import EventItem from "../components/items/EventItem.vue";
import { normalizeEventDate } from "~/src/utils/dates";
import { useFavoritesStore } from "~/src/stores/paseshow/favorites";
import PullToRefresh from "../components/ui/PullToRefresh.vue";

const props = defineProps<{ query?: string; favoritesOnly?: boolean }>();
const favoritesOnly = computed(() => !!props.favoritesOnly);
const eventsStore = useEventsStore();
const favorites = useFavoritesStore();
favorites.load();
const events = ref<any[]>([]);
const filtered = computed(() => {
  const q = (props.query || "").toLowerCase().trim();
  const base = favoritesOnly.value
    ? events.value.filter((e) => favorites.isFavorite(e.id))
    : events.value;
  if (!q) return base;
  return base.filter((e) =>
    String(e.name || "")
      .toLowerCase()
      .includes(q)
  );
});

// Función de refresh simplificada
const handleRefresh = async () => {
  try {
    await eventsStore.refreshEvents();

    // Recargar y remapear eventos
    const mapped = eventsStore.eventsList().map((item: any) => {
      const ts = normalizeEventDate(item);
      return {
        ...item,
        name: item.nombre || item.name,
        highlightedDate: ts,
      };
    }) as any[];

    // Orden: más próximos primero; los que no tienen fecha quedan al final
    mapped.sort((a: any, b: any) => {
      const ad = a.highlightedDate;
      const bd = b.highlightedDate;
      const aOk = typeof ad === "number" && !Number.isNaN(ad);
      const bOk = typeof bd === "number" && !Number.isNaN(bd);
      if (aOk && bOk) return ad - bd;
      if (aOk && !bOk) return -1;
      if (!aOk && bOk) return 1;
      return 0;
    });

    events.value = mapped;
  } catch (error) {
    console.error("❌ Error al actualizar eventos:", error);
  }
};

// Exponer la función para que pueda ser llamada desde el componente padre
defineExpose({ handleRefresh });

onMounted(async () => {
  await eventsStore.fetchAllEvents();

  const mapped = eventsStore.eventsList().map((item: any) => {
    const ts = normalizeEventDate(item);
    return {
      ...item,
      name: item.nombre || item.name,
      highlightedDate: ts,
    };
  }) as any[];

  // Orden: más próximos primero; los que no tienen fecha quedan al final
  mapped.sort((a: any, b: any) => {
    const ad = a.highlightedDate;
    const bd = b.highlightedDate;
    const aOk = typeof ad === "number" && !Number.isNaN(ad);
    const bOk = typeof bd === "number" && !Number.isNaN(bd);
    if (aOk && bOk) return ad - bd; // ascendente
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return 0;
  });

  events.value = mapped;
});
</script>
