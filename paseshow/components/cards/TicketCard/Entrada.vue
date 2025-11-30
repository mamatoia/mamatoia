<template>
  <h2 class="text-2xl font-bold mb-2">
    {{ eventName }}
  </h2>
  <div class="mb-2 text-lg opacity-90">{{ fecha }} - {{ hora }}</div>
  <UiIcon :name="icon" class="w-20 h-20 mb-2" />

  <div class="w-50 max-w-xs mx-auto mb-2 text-center">
    <span class="text-lg font-semibold">Usuario:&nbsp;</span>
    <span class="text-lg">{{ usuario }}</span>
  </div>
  <div class="w-50 max-w-xs mx-auto mb-4 text-center">
    <span class="text-lg font-semibold">DNI:&nbsp;</span>
    <span class="text-lg">{{ dni }}</span>
  </div>

  <div class="mb-6 flex flex-col items-center">
    <span class="text-4xl font-bold mt-4">{{ sector }}</span>
  </div>

  <div class="w-50 max-w-xs rounded bg-black/20 p-4 mt-2">
    <div class="mb-1 flex justify-between">
      <span class="font-semibold">Transacción:</span>
      <span>{{ transaccion }}</span>
    </div>
    <div class="flex justify-between">
      <span class="font-semibold">ID:</span>
      <span>{{ id }}</span>
    </div>
  </div>

  <div class="w-50 max-w-xs flex justify-center mt-4 gap-x-6">
    <div>
      <span class="text-lg font-semibold">Fila:&nbsp;</span>
      <span>{{ fila }}</span>
    </div>
    <div>
      <span class="text-lg font-semibold">Butaca:&nbsp;</span>
      <span>{{ butaca }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import UiIcon from "~/components/ui/Icon.vue";
import { ref, computed, onMounted } from "vue";
import type { TicketDataLike } from "./useTicketAccess";

const props = defineProps<{ data: TicketDataLike | null; icon: string }>();

// Defaults
const defaults = {
  eventName: "Nombre del Evento",
  fecha: "viernes 15 de marzo",
  hora: "21:00",
  usuario: "Pepe Gómez",
  dni: "12345678",
  sector: "Platea Baja",
  fila: 5,
  butaca: 12,
};

// Util para fechas
const parseToDate = (val: any): Date | null => {
  if (val == null) return null;
  if (typeof val === "number") return new Date(val);
  if (typeof val === "string") {
    if (/^\d+$/.test(val)) {
      const n = parseInt(val, 10);
      if (String(n).length === 10) return new Date(n * 1000);
      return new Date(n);
    }
    const p = Date.parse(val);
    return isNaN(p) ? null : new Date(p);
  }
  return null;
};

// Transacción local (fallback cuando no hay reserva)
const transaccion = ref<number | string>(0);
onMounted(() => {
  if (!props.data) {
    transaccion.value = Math.floor(Math.random() * 1000000);
  } else if (props.data.reservaId?.id) {
    transaccion.value = props.data.reservaId.id as any;
  }
});

// Computed de presentación
const eventName = computed(
  () => props.data?.sectorEventoId?.eventoId?.nombre ?? defaults.eventName
);
const fecha = computed(() => {
  const d = parseToDate(props.data?.sectorEventoId?.fechaFuncion);
  return d
    ? d.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : defaults.fecha;
});
const hora = computed(() => {
  const d = parseToDate(props.data?.sectorEventoId?.fechaFuncion);
  return d
    ? d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    : defaults.hora;
});
const usuario = computed(
  () => props.data?.reservaId?.clienteId?.nombre ?? defaults.usuario
);
const dni = computed(() => props.data?.dni ?? defaults.dni);
const sector = computed(
  () => props.data?.sectorEventoId?.sectorId?.nombre ?? defaults.sector
);
const id = computed(() => props.data?.id ?? transaccion.value);
const fila = computed(() => props.data?.ubicacionId?.fila ?? defaults.fila);
const butaca = computed(
  () => props.data?.ubicacionId?.etiqueta ?? defaults.butaca
);
</script>
