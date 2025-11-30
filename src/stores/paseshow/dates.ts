import { defineStore } from "pinia";

export const useDatesStore = defineStore("dates", {
  state: () => ({
    // Array de fechas únicas del evento
    // Estructura sugerida: { fechaFuncion: number, descripcion?: string, fechaLimite?: number }
    dates: [] as any[],
  }),
  actions: {
    setDates(list: any[]) {
      // Normaliza a objetos { fechaFuncion, ... } y quita duplicados por fechaFuncion
      type DateItem = {
        fechaFuncion: number;
        descripcion?: string;
        fechaLimite?: number | null;
      };
      const normalized: DateItem[] = (list || [])
        .map((d: any) => {
          if (typeof d === "number") return { fechaFuncion: d } as DateItem;
          if (d && typeof d === "object")
            return {
              fechaFuncion: Number(d.fechaFuncion ?? d.timestamp ?? d.ts ?? 0),
              descripcion: d.descripcion,
              fechaLimite: d.fechaLimite ?? null,
            } as DateItem;
          return null as unknown as DateItem;
        })
        .filter(
          (d: any): d is DateItem => !!d && !Number.isNaN(d.fechaFuncion)
        );

      const seen = new Set<number>();
      const uniques: any[] = [];
      for (const d of normalized) {
        if (!seen.has(d.fechaFuncion)) {
          seen.add(d.fechaFuncion);
          uniques.push(d);
        }
      }

      // Ordena ascendentemente por fecha
      uniques.sort((a, b) => a.fechaFuncion - b.fechaFuncion);
      this.dates = uniques;
    },
    clear() {
      this.dates = [];
    },
  },

  getters: {
    list: (state) => state.dates,
    timestamps: (state) => state.dates.map((d: any) => d.fechaFuncion),
    firstDate: (state) => state.dates[0] || null,
  },
});
