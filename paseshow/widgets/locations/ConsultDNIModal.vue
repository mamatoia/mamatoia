<template>
  <!-- Popover variant (anchored next to the trigger) -->
  <teleport to="body">
    <div
      v-if="showPopover && anchorRect"
      :style="
        Object.assign({}, popoverStyle, {
          '--rounded-box': '0.125rem',
          borderRadius: '0.125rem',
        })
      "
      class="bg-base-100 rounded-sm shadow p-4 z-50"
    >
      <h3 class="font-bold text-base mb-4">Ingresar DNI</h3>
      <div class="form-control">
        <input
          v-model="dni"
          type="text"
          class="input input-bordered w-full text-base"
          placeholder="Número de documento"
          @keyup.enter="submit"
        />
      </div>
      <div class="mt-4 flex gap-2 justify-end">
        <button class="btn btn-sm text-sm" @click="close">Cancelar</button>
        <button
          class="btn btn-sm text-white text-sm"
          style="
            background-color: var(--color-primary);
            border-color: var(--color-primary);
          "
          :disabled="loading || !dni.trim()"
          @click="submit"
        >
          {{ loading ? "Procesando…" : "Consultar" }}
        </button>
      </div>
      <div v-if="error" class="alert alert-error mt-2 text-sm">{{ error }}</div>
    </div>
  </teleport>

  <!-- Regular centered dialog fallback -->
  <teleport to="body">
    <dialog v-if="!showPopover" ref="dlg" class="modal" style="z-index: 9999">
      <div
        class="modal-box w-80 max-w-full p-4 rounded-sm"
        :style="{ '--rounded-box': '0.125rem', borderRadius: '0.125rem' }"
      >
        <h3 class="font-bold text-base mb-4">Ingresar DNI</h3>
        <div class="form-control">
          <input
            v-model="dni"
            type="text"
            class="input input-bordered w-full text-base"
            placeholder="Número de documento"
            @keyup.enter="submit"
          />
        </div>

        <div class="modal-action">
          <button class="btn btn-sm text-sm" @click="close">Cancelar</button>
          <button
            class="btn btn-sm text-white text-sm"
            style="
              background-color: var(--color-primary);
              border-color: var(--color-primary);
            "
            :disabled="loading || !dni.trim()"
            @click="submit"
          >
            {{ loading ? "Procesando…" : "Consultar" }}
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
import { useRoute } from "vue-router";
import { useLocationsStore } from "~/src/stores/paseshow/locations";

const dlg = ref<HTMLDialogElement | null>(null);
const dni = ref("");
const showPopover = ref(false);
const anchorRect = ref<DOMRect | null>(null);

const popoverStyle = computed(() => {
  if (!anchorRect.value) return {};
  const rect = anchorRect.value;
  const scrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
  const scrollX = typeof window !== "undefined" ? window.scrollX || 0 : 0;
  // try to position below the trigger
  let top = rect.bottom + 8 + scrollY;
  let left = rect.left + scrollX;
  // basic clamp to viewport
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const maxLeft = Math.max(8, vw - 320);
  if (left > maxLeft) left = maxLeft;
  return {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
  } as Record<string, string>;
});

const route = useRoute();
const store = useLocationsStore();
const loading = computed(() => store.isLoadingDNI);
const error = computed(() => store.errorDNI);

const open = (opts?: { anchorRect?: DOMRect }) => {
  dni.value = ""; // Limpiar campo al abrir
  if (opts?.anchorRect) {
    anchorRect.value = opts.anchorRect;
    showPopover.value = true;
  } else {
    showPopover.value = false;
    dlg.value?.showModal();
  }
};

const close = () => {
  dni.value = ""; // Limpiar campo al cerrar
  showPopover.value = false;
  try {
    dlg.value?.close();
  } catch {}
};

const submit = async () => {
  if (!dni.value.trim()) return;

  try {
    // Obtener contexto actual desde la ruta
    const pDate = (route.params as any)?.date as string | undefined;
    const pSector = (route.params as any)?.sector as string | undefined;
    const qDate = route.query?.fecha as string | undefined;
    const qSector = route.query?.sector as string | undefined;

    const fechaFuncion = pDate || qDate || "";
    const sectorEventoId = pSector || qSector || "";

    // DEBUG: indicar que se ejecuta el submit y mostrar params (usar console.log para visibilidad)
    console.log("ConsultDNIModal.submit -> executing", {
      dni: dni.value,
      fechaFuncion,
      sectorEventoId,
    });

    await store.consultaDNI({
      dni: dni.value.trim(),
      fechaFuncion,
      sectorEventoId: sectorEventoId || undefined,
    });

    console.log("ConsultDNIModal.submit -> store.consultaDNI resolved");

    // Cerrar modal automáticamente después de consulta exitosa
    close();
  } catch (e) {
    // El error se maneja en el store, mantener modal abierto para mostrar error
    console.error("ConsultDNIModal.submit -> error calling consultaDNI:", e);
  }
};

defineExpose({ open, close });
</script>
