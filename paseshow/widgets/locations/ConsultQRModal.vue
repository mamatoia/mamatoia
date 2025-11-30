<template>
  <teleport to="body">
    <dialog ref="dlg" class="modal">
      <div class="modal-box w-80 max-w-full p-4">
        <h3 class="font-bold text-base mb-4">Consultar por QR</h3>
        <div class="form-control">
          <label class="label"
            ><span class="label-text text-base">QR</span></label
          >
          <input
            v-model="qr"
            type="text"
            class="input input-bordered w-full text-base"
            placeholder="Pega el código QR"
          />
        </div>
        <div class="form-control mt-4">
          <label class="label"
            ><span class="label-text text-base">Sector Evento (opcional)</span>
          </label>
          <input
            v-model="sectorEventoId"
            type="text"
            class="input input-bordered w-full text-base"
            :class="{ 'input-success': sectorEventoId }"
            placeholder="ID de sectorEvento"
          />
        </div>

        <div class="modal-action">
          <button class="btn btn-sm text-sm" @click="close">Cerrar</button>
          <button
            class="btn btn-primary btn-sm text-white text-sm"
            :disabled="loading || !qr"
            @click="submit"
          >
            {{ loading ? "Consultando…" : "Consultar" }}
          </button>
        </div>

        <div v-if="error" class="alert alert-error mt-4 text-sm">
          {{ error }}
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useLocationsStore } from "../../../src/stores/paseshow/locations";

const dlg = ref<HTMLDialogElement | null>(null);
const qr = ref("");
const sectorEventoId = ref("");

const store = useLocationsStore();
const loading = computed(() => store.isLoadingQR);
const error = computed(() => store.errorQR);
const results = computed(() => store.qrResults);

import { useRoute } from "vue-router";
const route = useRoute();
const open = () => {
  const pSector = (route.params as any)?.sector as string | undefined;
  const qSector = route.query?.sector as string | undefined; // Cambiar de 'sectorEventoId' a 'sector'
  const sectorRaw = pSector || qSector;
  if (sectorRaw) sectorEventoId.value = String(sectorRaw);
  dlg.value?.showModal();
};
const close = () => dlg.value?.close();

const submit = async () => {
  try {
    await store.consultaQR({
      qr: qr.value,
      sectorEventoId: sectorEventoId.value || undefined,
    });
    // Cerrar modal automáticamente después de consulta exitosa
    close();
  } catch (e) {
    // handled in store, no cerrar modal si hay error
  }
};

defineExpose({ open, close });
</script>
