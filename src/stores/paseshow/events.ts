import { defineStore } from "pinia";
import { getAllEvents, getEvent } from "~/src/services/paseshow/events";
import { useDatesStore } from "~/src/stores/paseshow/dates";
import { useSectorsStore } from "~/src/stores/paseshow/sectors";

export const useEventsStore = defineStore("events", {
  state: () => ({
    events: [] as any[],
    listas: [] as any[],
    event: null as any | null,
    currentEventId: null as string | null,
    detailsById: {} as Record<string, any[]>,
    // Nuevos campos para caché inteligente
    lastFetch: null as number | null,
    loading: false,
    refreshing: false,
    error: null as string | null,
  }),
  actions: {
    // Verificar si el caché está vigente (ahora siempre válido hasta refresh manual)
    isCacheValid(): boolean {
      return this.lastFetch !== null && this.events.length > 0;
    },

    // Obtener eventos (con caché inteligente)
    async fetchAllEvents(forceRefresh = false) {
      // Si hay datos en caché y están vigentes, no hacer nueva llamada
      if (!forceRefresh && this.events.length > 0 && this.isCacheValid()) {
        // Eventos cargados desde caché
        return this.events;
      }

      // Obteniendo eventos desde la API
      this.loading = true;
      this.error = null;

      try {
        const freshEvents = (await getAllEvents()) as any[];
        this.events = freshEvents;
        this.lastFetch = Date.now();
        // Eventos actualizados
        return freshEvents;
      } catch (error: any) {
        console.error("❌ Error obteniendo eventos:", error);
        this.error = error?.message || "Error al cargar eventos";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Pull-to-refresh: actualizar eventos
    async refreshEvents() {
      if (this.refreshing) return; // Evitar múltiples refreshes simultáneos

      // Pull-to-refresh activado
      this.refreshing = true;

      try {
        await this.fetchAllEvents(true); // Forzar refresh
        // Eventos actualizados con pull-to-refresh
      } catch (error) {
        console.error("❌ Error en pull-to-refresh:", error);
        throw error;
      } finally {
        this.refreshing = false;
      }
    },

    // Invalidar caché manualmente
    invalidateCache() {
      this.lastFetch = null;
      // Caché de eventos invalidado
    },

    // Limpiar datos
    clearEvents() {
      this.events = [];
      this.lastFetch = null;
      this.error = null;
      // Datos de eventos limpiados
    },
    async fetchEvent(eventId: string) {
      try {
        const datesStore = useDatesStore();
        const sectorsStore = useSectorsStore();

        // 1) Revisar cache por eventId
        const cached = this.detailsById[eventId];
        if (Array.isArray(cached) && cached.length > 0) {
          this.event = cached;
          this.currentEventId = eventId;

          const datesCached = cached.map((r: any) => ({
            fechaFuncion: Number(r?.fechaFuncion ?? 0),
            descripcion: r?.descripcion,
            fechaLimite: r?.fechaLimite ?? null,
            eventoNombre: r?.eventoNombre || r?.nombreEvento || r?.nombre,
          }));
          datesStore.setDates(datesCached);
          sectorsStore.setAllFromPayload(cached);
          return cached;
        }

        // 2) No hay cache -> fetch
        const payload = (await getEvent(eventId)) as any[];
        this.event = payload;
        this.currentEventId = eventId;
        this.detailsById = { ...this.detailsById, [eventId]: payload };

        // 3) Poblar stores de fechas y sectores
        const dates = (payload || []).map((r: any) => ({
          fechaFuncion: Number(r?.fechaFuncion ?? 0),
          descripcion: r?.descripcion,
          fechaLimite: r?.fechaLimite ?? null,
          eventoNombre: r?.eventoNombre || r?.nombreEvento || r?.nombre,
        }));
        datesStore.setDates(dates);
        sectorsStore.setAllFromPayload(payload || []);

        return payload;
      } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
    },
  },

  getters: {
    eventsList: (state) => () => {
      return state.events;
    },

    // Nuevos getters para el estado del caché
    hasCache: (state) => {
      return state.events.length > 0 && state.lastFetch !== null;
    },

    cacheAge: (state) => {
      if (!state.lastFetch) return null;
      return Date.now() - state.lastFetch;
    },

    cacheStatus: (state) => {
      if (!state.lastFetch) return "empty";
      if (state.loading) return "loading";
      if (state.refreshing) return "refreshing";
      return "fresh"; // Siempre fresh hasta refresh manual
    },
    datesList: (_state) => (_eventId: string) => {
      // Lee desde dates store para mantener separación de responsabilidades
      const datesStore = useDatesStore();
      return datesStore.list;
    },
    sectorsList: (_state) => (eventIdOrFecha: string | number) => {
      // Para compatibilidad, si recibimos un eventId que no es timestamp,
      // devolvemos lista plana (todos los sectores). Si es timestamp válido, devolvemos por fecha.
      const sectorsStore = useSectorsStore();
      const ts = Number(eventIdOrFecha);
      if (!Number.isFinite(ts) || String(eventIdOrFecha).length < 11) {
        return sectorsStore.listAll;
      }
      return sectorsStore.byFecha(eventIdOrFecha as any);
    },
    eventsSortedByDate: (state) => () => {
      return [...state.events].sort((a, b) => {
        const dateA = new Date(a.fechaDestacad).getTime();
        const dateB = new Date(b.fechaDestacad).getTime();
        return dateA - dateB;
      });
    },
  },
});
