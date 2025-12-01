import { defineStore } from "pinia";

export const useSelectedSectorsStore = defineStore("selectedSectors", {
  state: () => ({
    selectedSectors: new Map<string, boolean>(), // key: eventId-fechaFuncion-sectorId, value: selected
  }),

  actions: {
    toggleSector(
      eventId: string,
      fechaFuncion: number | string,
      sectorId: string
    ) {
      const key = `${eventId}-${fechaFuncion}-${sectorId}`;
      const currentValue = this.selectedSectors.get(key) || false;
      this.selectedSectors.set(key, !currentValue);
    },

    setSectorSelected(
      eventId: string,
      fechaFuncion: number | string,
      sectorId: string,
      selected: boolean
    ) {
      const key = `${eventId}-${fechaFuncion}-${sectorId}`;
      this.selectedSectors.set(key, selected);
    },

    isSectorSelected(
      eventId: string,
      fechaFuncion: number | string,
      sectorId: string
    ): boolean {
      const key = `${eventId}-${fechaFuncion}-${sectorId}`;
      return this.selectedSectors.get(key) || false;
    },

    clearSelections() {
      this.selectedSectors.clear();
    },

    clearSelectionsForEvent(eventId: string, fechaFuncion?: number | string) {
      if (fechaFuncion !== undefined) {
        // Limpiar solo para un evento y fecha específicos
        const prefix = `${eventId}-${fechaFuncion}-`;
        Array.from(this.selectedSectors.keys())
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => this.selectedSectors.delete(key));
      } else {
        // Limpiar todo para un evento
        const prefix = `${eventId}-`;
        Array.from(this.selectedSectors.keys())
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => this.selectedSectors.delete(key));
      }
    },

    getSelectedSectors(eventId?: string, fechaFuncion?: number | string) {
      const entries = Array.from(this.selectedSectors.entries());

      if (!eventId) {
        return entries.map(([key, selected]) => {
          const [eId, fecha, sectorId] = key.split("-");
          return {
            eventId: eId,
            fechaFuncion: fecha,
            sectorId,
            selected,
          };
        });
      }

      if (fechaFuncion !== undefined) {
        // Filtrar por evento y fecha específicos
        const prefix = `${eventId}-${fechaFuncion}-`;
        return entries
          .filter(([key]) => key.startsWith(prefix))
          .map(([key, selected]) => {
            const [, , sectorId] = key.split("-");
            return {
              eventId,
              fechaFuncion,
              sectorId,
              selected,
            };
          });
      }

      // Filtrar solo por evento
      const prefix = `${eventId}-`;
      return entries
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, selected]) => {
          const [, fecha, sectorId] = key.split("-");
          return {
            eventId,
            fechaFuncion: fecha,
            sectorId,
            selected,
          };
        });
    },
  },

  getters: {
    selectedCount: (state) => {
      return Array.from(state.selectedSectors.values()).filter(Boolean).length;
    },

    getSelectedCountForEvent:
      (state) => (eventId: string, fechaFuncion?: number | string) => {
        if (fechaFuncion !== undefined) {
          const prefix = `${eventId}-${fechaFuncion}-`;
          return Array.from(state.selectedSectors.entries()).filter(
            ([key, selected]) => key.startsWith(prefix) && selected
          ).length;
        }

        const prefix = `${eventId}-`;
        return Array.from(state.selectedSectors.entries()).filter(
          ([key, selected]) => key.startsWith(prefix) && selected
        ).length;
      },
  },
});
