import { defineStore } from "pinia";
import {
  consultaQR as svcConsultaQR,
  consultaDNI as svcConsultaDNI,
  type ConsultaQRParams,
  type ConsultaDNIParams,
} from "~/src/services/paseshow/locations/index";

export const useLocationsStore = defineStore("locations", {
  state: () => ({
    lastQR: [] as any[],
    lastDNI: [] as any[],
    // Estados locales por id para reflejar registros aplicados en esta sesión
    localAccessStates: {} as Record<string, "E" | "S" | "N">,
    // (no local recent-registration deduper)
    isApplyingQR: false,
    isApplyingDNI: false,
    loadingQR: false,
    loadingDNI: false,
    errorQR: null as string | null,
    errorDNI: null as string | null,
    // Meta de último escaneo QR
    lastQRCode: null as string | null,
    lastQRAt: null as number | null,
    qrVersion: 0,
    // Mensaje de estado del último registro
    lastStatusMessage: "" as string,
    lastStatusColor: "" as string,
  }),
  actions: {
    async consultaQR(params: ConsultaQRParams) {
      this.errorQR = null;
      this.loadingQR = true;
      // Registrar intento de consulta para feedback en UI aun si falla
      this.lastQRCode = params.qr || null;
      this.lastQRAt = Date.now();
      try {
        let data = await svcConsultaQR(params);
        // Fallback: si con sector viene vacío, reintentar sin sector
        if (Array.isArray(data) && data.length === 0 && params.sectorEventoId) {
          try {
            const alt = await svcConsultaQR({ qr: params.qr });
            if (Array.isArray(alt)) data = alt;
          } catch (_) {
            // ignorar, mantener data original
          }
        }
        const items = Array.isArray(data) ? data : [];
        this.isApplyingQR = true;
        try {
          const { nextTick } = await import("vue");
          await nextTick();
          // Mutar el array in-place para evitar re-creaciones que fuerzan muchos patches
          this.lastQR.splice(0, this.lastQR.length, ...items);
          // Overlay con estados locales persistentes en sesión
          try {
            for (let i = 0; i < this.lastQR.length; i++) {
              const it = this.lastQR[i];
              const id = it?.id != null ? String(it.id) : null;
              if (id && this.localAccessStates[id]) {
                try {
                  it.ingreso = this.localAccessStates[id];
                } catch (_) {
                  /* ignore */
                }
              }
            }
          } catch (_) {
            /* ignore overlay */
          }
          this.qrVersion++;
        } catch (err) {
          console.error(
            "locations.store.consultaQR -> error applying results to state",
            err
          );
          // Fallback: asignación directa
          this.lastQR = items;
          this.qrVersion++;
        } finally {
          this.isApplyingQR = false;
        }
        return this.lastQR;
      } catch (e: any) {
        const status = e?.statusCode || e?.status;
        const msg = e?.data?.message || e?.message;
        this.errorQR = status
          ? `${status}: ${msg || "Error consultando QR"}`
          : msg || "Error consultando QR";
        this.lastQR = [];
        throw e;
      } finally {
        this.loadingQR = false;
      }
    },

    // (no local recently-registered helpers)
    // Consultar por DNI (usado desde modal y otras partes)
    async consultaDNI(params: ConsultaDNIParams) {
      this.errorDNI = null;
      this.loadingDNI = true;
      try {
        const data = await svcConsultaDNI(params);
        // Soportar respuestas que vienen envueltas: { content: [...] } o directamente []
        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (data && Array.isArray((data as any).content))
          items = (data as any).content;
        else if (data && Array.isArray((data as any).result))
          items = (data as any).result;

        this.isApplyingDNI = true;
        try {
          const { nextTick } = await import("vue");
          await nextTick();
          this.lastDNI.splice(0, this.lastDNI.length, ...items);
          // Mostrar un pequeño preview en logs (usar console.log para visibilidad)
          console.log(
            "locations.store.consultaDNI -> stored items count:",
            items.length
          );
          if (items.length > 0)
            console.log(
              "locations.store.consultaDNI -> sample:",
              JSON.stringify(items[0]).slice(0, 1000)
            );
          // Overlay con estados locales persistentes en sesión
          try {
            for (let i = 0; i < this.lastDNI.length; i++) {
              const it = this.lastDNI[i];
              const id = it?.id != null ? String(it.id) : null;
              if (id && this.localAccessStates[id]) {
                try {
                  it.ingreso = this.localAccessStates[id];
                } catch (_) {
                  /* ignore */
                }
              }
            }
          } catch (_) {
            /* ignore overlay */
          }
        } catch (err) {
          console.error(
            "locations.store.consultaDNI -> error applying results to state",
            err
          );
          this.lastDNI = items;
        } finally {
          this.isApplyingDNI = false;
        }
        return this.lastDNI;
      } catch (e: any) {
        const status = e?.statusCode || e?.status;
        const msg = e?.data?.message || e?.message;
        this.errorDNI = status
          ? `${status}: ${msg || "Error consultando DNI"}`
          : msg || "Error consultando DNI";
        this.lastDNI = [];
        throw e;
      } finally {
        this.loadingDNI = false;
      }
    },
    clear() {
      this.lastQR = [];
      this.lastDNI = [];
      this.errorQR = null;
      this.errorDNI = null;
      this.lastQRCode = null;
      this.lastQRAt = null;
      this.qrVersion = 0;
      this.lastStatusMessage = "";
      this.lastStatusColor = "";
      // cleared state
    },
    // Setea estado local para un id (ej: tras un registro exitoso)
    setLocalIngreso(id: any, ingreso: "E" | "S" | "N") {
      try {
        if (!id) return;
        const key = id?.toString?.() ?? String(id);
        this.localAccessStates[key] = ingreso;
      } catch (_) {
        /* ignore */
      }
    },
    setStatusMessage(message: string, color: string) {
      this.lastStatusMessage = message;
      this.lastStatusColor = color;
    },
  },
  getters: {
    qrResults: (state) => state.lastQR,
    dniResults: (state) => state.lastDNI,
    isLoadingQR: (state) => state.loadingQR,
    isLoadingDNI: (state) => state.loadingDNI,
    lastQRCodeValue: (state) => state.lastQRCode,
    lastQRAtValue: (state) => state.lastQRAt,
    qrVersionValue: (state) => state.qrVersion,
  },
});
