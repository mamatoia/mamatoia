import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

const STORAGE_KEY = "paseshow-selections";

// Tipo para la estructura relacional
type SelectionStructure = {
  [eventId: string]: {
    [dateId: string]: string[]; // array de sectorIds
  };
};

// Funciones de persistencia
const loadFromStorage = (): SelectionStructure => {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Error loading selections from storage:", error);
  }
  return {};
};

const saveToStorage = (selections: SelectionStructure) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  } catch (error) {
    console.warn("Error saving selections to storage:", error);
  }
};

export const useSelectionsStore = defineStore("selections", () => {
  // Estado principal con estructura relacional
  const selections = ref<SelectionStructure>({});

  // Flag para controlar si ya se inicializó desde storage
  const _initialized = ref(false);

  // Getters para verificar selecciones
  const isEventSelected = (eventId: string | number): boolean => {
    const eventKey = String(eventId);
    return (
      !!selections.value[eventKey] &&
      Object.keys(selections.value[eventKey]).length > 0
    );
  };

  const isDateSelected = (
    eventId: string | number,
    dateId: string | number
  ): boolean => {
    const eventKey = String(eventId);
    const dateKey = String(dateId);
    return !!selections.value[eventKey]?.[dateKey];
  };

  const isSectorSelected = (
    eventId: string | number,
    dateId: string | number,
    sectorId: string | number
  ): boolean => {
    const eventKey = String(eventId);
    const dateKey = String(dateId);
    const sectorKey = String(sectorId);
    return selections.value[eventKey]?.[dateKey]?.includes(sectorKey) ?? false;
  };

  // Contadores
  const selectedEventsCount = computed(
    () => Object.keys(selections.value).length
  );

  const selectedDatesCount = computed(() => {
    let count = 0;
    Object.values(selections.value).forEach((event) => {
      count += Object.keys(event).length;
    });
    return count;
  });

  const selectedSectorsCount = computed(() => {
    let count = 0;
    Object.values(selections.value).forEach((event) => {
      Object.values(event).forEach((sectors) => {
        count += sectors.length;
      });
    });
    return count;
  });

  const totalSelectedCount = computed(
    () =>
      selectedEventsCount.value +
      selectedDatesCount.value +
      selectedSectorsCount.value
  );

  // Actions para eventos (seleccionar evento implica crear estructura vacía)
  const selectEvent = (eventId: string | number) => {
    const eventKey = String(eventId);
    if (!selections.value[eventKey]) {
      selections.value[eventKey] = {};
    }
  };

  const unselectEvent = (eventId: string | number) => {
    const eventKey = String(eventId);
    delete selections.value[eventKey];
  };

  // Actions para fechas
  const selectDate = (eventId: string | number, dateId: string | number) => {
    const eventKey = String(eventId);
    const dateKey = String(dateId);

    // Asegurar que el evento existe
    if (!selections.value[eventKey]) {
      selections.value[eventKey] = {};
    }

    // Crear array vacío para sectores si no existe
    if (!selections.value[eventKey][dateKey]) {
      selections.value[eventKey][dateKey] = [];
    }
  };

  const unselectDate = (eventId: string | number, dateId: string | number) => {
    const eventKey = String(eventId);
    const dateKey = String(dateId);

    if (selections.value[eventKey]) {
      delete selections.value[eventKey][dateKey];

      // Si no quedan fechas, eliminar el evento
      if (Object.keys(selections.value[eventKey]).length === 0) {
        delete selections.value[eventKey];
      }
    }
  };

  // Actions para sectores
  const toggleSectorSelection = (
    eventId: string | number,
    dateId: string | number,
    sectorId: string | number
  ) => {
    const eventKey = String(eventId);
    const dateKey = String(dateId);
    const sectorKey = String(sectorId);

    // Asegurar estructura existe
    if (!selections.value[eventKey]) {
      selections.value[eventKey] = {};
    }
    if (!selections.value[eventKey][dateKey]) {
      selections.value[eventKey][dateKey] = [];
    }

    const sectors = selections.value[eventKey][dateKey];
    const index = sectors.indexOf(sectorKey);

    if (index > -1) {
      // Quitar sector
      sectors.splice(index, 1);

      // Si no quedan sectores, eliminar la fecha
      if (sectors.length === 0) {
        delete selections.value[eventKey][dateKey];

        // Si no quedan fechas, eliminar el evento
        if (Object.keys(selections.value[eventKey]).length === 0) {
          delete selections.value[eventKey];
        }
      }
    } else {
      // Agregar sector
      sectors.push(sectorKey);
    }
  };

  // Función para inicializar desde storage (llamar en cliente)
  const initializeFromStorage = () => {
    if (_initialized.value || typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        selections.value = parsed;
      }
      _initialized.value = true;
    } catch (error) {
      console.warn("Error initializing selections from storage:", error);
      _initialized.value = true;
    }
  };

  // Actions globales
  const clearAllSelections = () => {
    selections.value = {};
  };

  // Persistir cambios automáticamente (solo después de inicializar)
  watch(
    selections,
    (newSelections) => {
      if (_initialized.value) {
        saveToStorage(newSelections);
      }
    },
    { deep: true }
  );

  // Método para el scanner - devuelve contextos de búsqueda estructurados
  const getScannerContexts = () => {
    const contexts: Array<{
      eventId: string;
      dateId: string;
      sectors: string[];
    }> = [];

    Object.entries(selections.value).forEach(([eventId, dates]) => {
      Object.entries(dates).forEach(([dateId, sectors]) => {
        if (sectors.length > 0) {
          // Solo incluir fechas con sectores
          contexts.push({
            eventId,
            dateId: dateId.replace("date-", ""), // Limpiar prefijo
            sectors: sectors.map((s) =>
              s.startsWith("sector-") ? s.replace("sector-", "") : s
            ),
          });
        }
      });
    });

    return contexts;
  };

  // Método legacy para compatibilidad (devuelve el primer contexto encontrado)
  const getSelectionContext = () => {
    const contexts = getScannerContexts();
    const firstContext = contexts[0];

    return {
      hasSelections: contexts.length > 0,
      selectedEvents: firstContext ? [firstContext.eventId] : [],
      selectedDates: firstContext ? [firstContext.dateId] : [],
      selectedSectors: firstContext ? firstContext.sectors : [],
      counts: {
        events: selectedEventsCount.value,
        dates: selectedDatesCount.value,
        sectors: selectedSectorsCount.value,
        total: totalSelectedCount.value,
      },
    };
  };

  return {
    // State
    selections,

    // Getters
    isEventSelected,
    isDateSelected,
    isSectorSelected,
    selectedEventsCount,
    selectedDatesCount,
    selectedSectorsCount,
    totalSelectedCount,

    // Actions
    selectEvent,
    unselectEvent,
    selectDate,
    unselectDate,
    toggleSectorSelection,
    clearAllSelections,

    // Initialization
    initializeFromStorage,

    // Scanner methods
    getScannerContexts,
    getSelectionContext, // Legacy compatibility
  };
});
