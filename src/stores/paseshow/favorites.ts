import { defineStore } from "pinia";

type ID = number | string;

const toKey = (id: ID) => String(id);

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    eventIds: [] as string[],
    _loaded: false,
  }),
  getters: {
    isFavorite: (state) => (id: ID) => state.eventIds.includes(toKey(id)),
  },
  actions: {
    load() {
      if (this._loaded) return;
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem("ps:favorites:events");
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        this.eventIds = Array.isArray(parsed)
          ? (parsed as any[]).map((x) => String(x))
          : [];
      } catch {
        this.eventIds = [];
      } finally {
        this._loaded = true;
      }
    },
    save() {
      if (typeof window === "undefined") return;
      localStorage.setItem(
        "ps:favorites:events",
        JSON.stringify(this.eventIds)
      );
    },
    toggleEvent(id: ID) {
      this.load();
      const key = toKey(id);
      const idx = this.eventIds.indexOf(key);
      if (idx >= 0) this.eventIds.splice(idx, 1);
      else this.eventIds.push(key);
      this.save();
    },
    setEvent(id: ID, value: boolean) {
      this.load();
      const key = toKey(id);
      const has = this.eventIds.includes(key);
      if (value && !has) this.eventIds.push(key);
      if (!value && has) this.eventIds = this.eventIds.filter((x) => x !== key);
      this.save();
    },
    clearAll() {
      this.eventIds = [];
      this.save();
    },
  },
});
