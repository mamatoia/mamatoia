import { defineStore } from "pinia";
import { BaseSelectionStore, type SelectionKey } from "./base";

/**
 * Implementación específica para fechas
 * Respeta el principio de responsabilidad única
 */
export interface DateSelectionKey extends SelectionKey {
  eventId: string;
  fechaFuncion: number;
}

class DateSelectionManager extends BaseSelectionStore<DateSelectionKey> {
  protected generateKey(item: DateSelectionKey): string {
    return `${item.eventId}-${item.fechaFuncion}`;
  }

  parseKey(key: string) {
    const [eventId, fechaStr] = key.split("-");
    return {
      eventId,
      fechaFuncion: parseInt(fechaStr),
    };
  }

  /**
   * Método específico para fechas: obtener conteo por evento
   */
  getCountForEvent(eventId: string): number {
    return this.getByPrefix(`${eventId}-`).filter((item) => item.selected)
      .length;
  }

  /**
   * Método específico para fechas: limpiar por evento
   */
  clearForEvent(eventId: string): void {
    this.clearByPrefix(`${eventId}-`);
  }

  /**
   * Obtener fechas seleccionadas para un evento específico
   */
  getSelectedForEvent(
    eventId: string
  ): Array<{ eventId: string; fechaFuncion: number; selected: boolean }> {
    return this.getByPrefix(`${eventId}-`).map(({ key, selected }) => ({
      ...this.parseKey(key),
      selected,
    }));
  }
}

/**
 * Store de Pinia que usa la clase de gestión
 */
export const useSelectedDatesStore = defineStore("selectedDates", {
  state: () => ({
    manager: new DateSelectionManager(),
  }),

  actions: {
    toggleDate(eventId: string, fechaFuncion: number): boolean {
      return this.manager.toggle({ eventId, fechaFuncion });
    },

    setDateSelected(
      eventId: string,
      fechaFuncion: number,
      selected: boolean
    ): void {
      this.manager.setSelected({ eventId, fechaFuncion }, selected);
    },

    isDateSelected(eventId: string, fechaFuncion: number): boolean {
      return this.manager.isSelected({ eventId, fechaFuncion });
    },

    clearSelections(): void {
      this.manager.clearAll();
    },

    clearSelectionsForEvent(eventId: string): void {
      this.manager.clearForEvent(eventId);
    },

    getSelectedDates(eventId?: string) {
      if (!eventId) {
        return this.manager.getAllStructured();
      }
      return this.manager.getSelectedForEvent(eventId);
    },
  },

  getters: {
    selectedCount: (state) => state.manager.totalCount,

    getSelectedCountForEvent: (state) => (eventId: string) => {
      return state.manager.getCountForEvent(eventId);
    },
  },
});
