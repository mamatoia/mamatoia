<template>
  <!-- Mensajes cuando no hay resultados de QR -->
  <div v-if="!hasQR && hasSearchedQR" class="text-center text-gray-500 py-8">
    <template v-if="errorQR">
      <div class="alert alert-warning max-w-md mx-auto">
        <div>
          <span class="font-semibold">No se pudo consultar el QR</span>
          <div class="text-xs opacity-80 mt-1">{{ errorQR }}</div>
        </div>
      </div>
      <div class="mt-3 text-xs opacity-70">
        Intento con QR <span class="font-mono">{{ lastQRCode }}</span>
        <span v-if="lastQRAt" class="ml-1">({{ lastQRTime }})</span>
      </div>
    </template>
    <template v-else>
      No hay entradas para el QR
      <span class="font-mono">{{ lastQRCode }}</span>
      <span v-if="lastQRAt" class="block text-xs opacity-70"
        >({{ lastQRTime }})</span
      >
    </template>
  </div>

  <!-- Mensajes cuando no hay resultados de DNI -->
  <div v-if="!hasDNI && hasSearchedDNI" class="text-center text-gray-500 py-8">
    No hay entradas para ese DNI
  </div>
</template>

<script setup lang="ts">
// Este componente es puramente de presentación de mensajes.
// Recibe flags y valores ya calculados desde el padre (TicketsPanel).
defineProps<{
  hasQR: boolean;
  hasDNI: boolean;
  hasSearchedQR: boolean;
  hasSearchedDNI: boolean;
  errorQR: string;
  lastQRCode: string;
  lastQRAt: number;
  lastQRTime: string;
}>();
</script>
