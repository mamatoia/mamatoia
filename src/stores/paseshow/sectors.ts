import { defineStore } from "pinia";

export const useSectorsStore = defineStore("sectors", {
  state: () => ({
    byDate: {} as Record<string, any[]>,
    sectors: [] as any[],
  }),
  actions: {
    setAllFromPayload(rows: any[]) {
      const map: Record<string, any[]> = {};
      const flat: any[] = [];
      for (const r of rows || []) {
        const tsNumber = Number(r?.fechaFuncion ?? 0);
        const ts = String(tsNumber);
        if (!ts || ts === "0") continue;
        const sector = {
          name: r?.sectorId?.nombre || r?.nombreSector || r?.nombre || r?.name,
          capacity: r?.capacidad || r?.aforo || r?.capacity || 0,
          sectorEventoId: r?.sectorEventoId || r?.id || r?.sectorId?.id,
          fechaFuncion: tsNumber,
          raw: r,
        };
        if (!sector.name) continue;
        if (!map[ts]) map[ts] = [];
        map[ts].push(sector);
        flat.push(sector);
      }
      this.byDate = map;
      this.sectors = flat;
    },
    setSectorsForDate(fechaFuncion: number | string, sectors: any[]) {
      const key = String(Number(fechaFuncion || 0));
      if (!key || key === "0") return;
      this.byDate = { ...this.byDate, [key]: sectors || [] };
    },
    clear() {
      this.byDate = {};
      this.sectors = [];
    },
  },

  getters: {
    listAll: (state) => state.sectors,
    byFecha: (state) => (fechaFuncion: number | string) => {
      const key = String(Number(fechaFuncion || 0));
      return state.byDate[key] || [];
    },
    fechasConSectores: (state) => Object.keys(state.byDate),
  },
});
