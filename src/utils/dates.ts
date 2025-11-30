export const AR_TZ = "America/Argentina/Buenos_Aires";

export const isValidTs = (val: any): val is number =>
  typeof val === "number" && !Number.isNaN(val);

export const toTimestamp = (val: any): number | undefined => {
  if (val == null) return undefined;
  if (typeof val === "number") return val < 1e12 ? val * 1000 : val;
  if (typeof val === "string") {
    const n = Number(val);
    if (!Number.isNaN(n)) return n < 1e12 ? n * 1000 : n;
    // Si viene como YYYY-MM-DD (sin timezone), parsearlo como medianoche AR (-03:00)
    const dateOnly = val.match(/^\d{4}-\d{2}-\d{2}$/);
    if (dateOnly) {
      const t = Date.parse(`${val}T00:00:00-03:00`);
      return Number.isNaN(t) ? undefined : t;
    }
    // Si viene como ISO a medianoche Z, tratarlo como día local AR
    const midnightZ = val.match(/^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.\d+)?Z$/);
    if (midnightZ) {
      const day = midnightZ[1];
      const t = Date.parse(`${day}T00:00:00-03:00`);
      return Number.isNaN(t) ? undefined : t;
    }
    const t = Date.parse(val);
    return Number.isNaN(t) ? undefined : t;
  }
  return undefined;
};

// Orden unificado de campos de fecha conocidos en payloads
export const pickRawDate = (obj: any): any =>
  obj?.fechaDestacado ?? obj?.fechaDestacad ?? obj?.fechaFuncion ?? obj?.fecha;

export const normalizeEventDate = (obj: any): number | undefined =>
  toTimestamp(pickRawDate(obj));

// Clave estable por día usando timezone de Argentina (YYYY-MM-DD)
export const dayKeyAR = (ts: number | undefined): string | undefined => {
  if (!isValidTs(ts)) return undefined;
  return new Date(ts).toLocaleDateString("en-CA", { timeZone: AR_TZ });
};
