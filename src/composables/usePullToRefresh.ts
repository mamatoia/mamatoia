import { ref } from "vue";
import { useEventsStore } from "../stores/paseshow/events";

export function usePullToRefresh() {
  const eventsStore = useEventsStore();
  const isRefreshing = ref(false);

  // Método simple para refresh manual
  const refreshEvents = async () => {
    if (isRefreshing.value) return;

    // Actualizando eventos
    isRefreshing.value = true;

    try {
      await eventsStore.refreshEvents();
      // Eventos actualizados correctamente
    } catch (error) {
      console.error("❌ Error actualizando eventos:", error);
      throw error;
    } finally {
      isRefreshing.value = false;
    }
  };

  // Método para verificar y cargar eventos si es necesario
  const ensureEventsLoaded = async () => {
    if (eventsStore.events.length === 0 || !eventsStore.isCacheValid()) {
      await eventsStore.fetchAllEvents();
    }
  };

  return {
    isRefreshing,
    refreshEvents,
    ensureEventsLoaded,
    // Estados del store
    loading: () => eventsStore.loading,
    hasCache: () => eventsStore.hasCache,
    cacheStatus: () => eventsStore.cacheStatus,
  };
}
