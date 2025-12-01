import { defineStore } from "pinia";
import { BaseSelectionStore, type SelectionKey } from "./base";

/**
 * Implementación específica para sectores
 * Respeta el principio de responsabilidad única
 */
export interface SectorSelectionKey extends SelectionKey {
  eventId: string;
  fechaFuncion: number | string;
  sectorId: string;
}

class SectorSelectionManager extends BaseSelectionStore<SectorSelectionKey> {
  protected generateKey(item: SectorSelectionKey): string {
    return `${item.eventId}-${item.fechaFuncion}-${item.sectorId}`;
  }

  parseKey(key: string) {
    const [eventId, fechaFuncion, sectorId] = key.split("-");
    return {
      eventId,
      fechaFuncion,
      sectorId,
    };
  }

  /**
   * Método específico para sectores: obtener conteo por evento y fecha
   */
  getCountForEventAndDate(
    eventId: string,
    fechaFuncion?: number | string
  ): number {
    if (fechaFuncion !== undefined) {
      const prefix = `${eventId}-${fechaFuncion}-`;
      return this.getByPrefix(prefix).filter((item) => item.selected).length;
    }

    // Sin fecha específica, contar todos los sectores del evento
    const prefix = `${eventId}-`;
    return this.getByPrefix(prefix).filter((item) => item.selected).length;
  }

  /**
   * Método específico para sectores: limpiar por evento y opcionalmente fecha
   */
  clearForEventAndDate(eventId: string, fechaFuncion?: number | string): void {
    if (fechaFuncion !== undefined) {
      this.clearByPrefix(`${eventId}-${fechaFuncion}-`);
    } else {
      this.clearByPrefix(`${eventId}-`);
    }
  }

  /**
   * Obtener sectores seleccionados para un evento y fecha específicos
   */
  getSelectedForEventAndDate(
    eventId: string,
    fechaFuncion?: number | string
  ): Array<{
    eventId: string;
    fechaFuncion: string;
    sectorId: string;
    selected: boolean;
  }> {
    const prefix =
      fechaFuncion !== undefined
        ? `${eventId}-${fechaFuncion}-`
        : `${eventId}-`;

    return this.getByPrefix(prefix).map(({ key, selected }) => ({
      ...this.parseKey(key),
      selected,
    }));
  }
}

/**
 * Store de Pinia que usa la clase de gestión
 */
export const useSelectedSectorsStore = defineStore("selectedSectors", {
  state: () => ({
    manager: new SectorSelectionManager(),
  }),

  actions: {
    toggleSector(
      eventId: string,
      fechaFuncion: number | string,
      sectorId: string
    ): boolean {
      return this.manager.toggle({ eventId, fechaFuncion, sectorId });
    },

    setSectorSelected(
      eventId: string,
      fechaFuncion: number | string,
      sectorId: string,
      selected: boolean
    ): void {
      this.manager.setSelected({ eventId, fechaFuncion, sectorId }, selected);
    },

    isSectorSelected(
      eventId: string,
      fechaFuncion: number | string,
      sectorId: string
    ): boolean {
      return this.manager.isSelected({ eventId, fechaFuncion, sectorId });
    },

    clearSelections(): void {
      this.manager.clearAll();
    },

    clearSelectionsForEvent(
      eventId: string,
      fechaFuncion?: number | string
    ): void {
      this.manager.clearForEventAndDate(eventId, fechaFuncion);
    },

    getSelectedSectors(eventId?: string, fechaFuncion?: number | string) {
      if (!eventId) {
        return this.manager.getAllStructured();
      }
      return this.manager.getSelectedForEventAndDate(eventId, fechaFuncion);
    },
  },

  getters: {
    selectedCount: (state) => state.manager.totalCount,

    getSelectedCountForEvent:
      (state) => (eventId: string, fechaFuncion?: number | string) => {
        return state.manager.getCountForEventAndDate(eventId, fechaFuncion);
      },
  },
});
