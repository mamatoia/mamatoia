import { defineStore } from "pinia";

export const useSelectedDatesStore = defineStore("selectedDates", {
  state: () => ({
    selectedDates: new Map<string, boolean>(), // key: eventId-fechaFuncion, value: selected
  }),

  actions: {
    toggleDate(eventId: string, fechaFuncion: number) {
      const key = `${eventId}-${fechaFuncion}`;
      const currentValue = this.selectedDates.get(key) || false;
      this.selectedDates.set(key, !currentValue);
    },

    setDateSelected(eventId: string, fechaFuncion: number, selected: boolean) {
      const key = `${eventId}-${fechaFuncion}`;
      this.selectedDates.set(key, selected);
    },

    isDateSelected(eventId: string, fechaFuncion: number): boolean {
      const key = `${eventId}-${fechaFuncion}`;
      return this.selectedDates.get(key) || false;
    },

    clearSelections() {
      this.selectedDates.clear();
    },

    getSelectedDates(eventId?: string) {
      if (!eventId) {
        return Array.from(this.selectedDates.entries()).map(
          ([key, selected]) => {
            const [eId, fechaStr] = key.split("-");
            return {
              eventId: eId,
              fechaFuncion: parseInt(fechaStr),
              selected,
            };
          }
        );
      }

      return Array.from(this.selectedDates.entries())
        .filter(([key]) => key.startsWith(`${eventId}-`))
        .map(([key, selected]) => {
          const [, fechaStr] = key.split("-");
          return {
            eventId,
            fechaFuncion: parseInt(fechaStr),
            selected,
          };
        });
    },
  },

  getters: {
    selectedCount: (state) => {
      return Array.from(state.selectedDates.values()).filter(Boolean).length;
    },
  },
});
