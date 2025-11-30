<template>
  <div class="flex flex-col w-full bg-base-200 border-black rounded-box mb-4">
    <div class="font-bold text-sm mb-2 px-6">
      {{ title }}
    </div>
    <div class="flex flex-col w-full space-y-4">
      <div class="flex flex-col w-full mb-4 px-6">
        <label class="text-base-content text-sm font-semibold text-left">
          Servidor URL
        </label>
        <input
          type="text"
          class="input w-full rounded-sm bg-base-content text-base-200 border-base-200"
          v-model="servidorUrl"
          autocomplete="off"
        />
      </div>
      <div class="flex flex-col w-full px-6 mb-4">
        <label class="text-base-content text-sm font-semibold text-left">
          Evento
        </label>
        <input
          type="text"
          class="input w-full rounded-sm bg-base-content text-base-200 border-base-200"
          v-model="evento"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center justify-between w-full px-6 mb-4">
        <label class="text-base-content text-sm font-semibold m-0">
          Habilitar
        </label>
        <input
          type="checkbox"
          class="toggle toggle-success"
          v-model="habilitar"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const servidorUrl = ref("https://api.paseshow.com.ar/");
const habilitar = ref(false);

defineProps({
  title: { type: String, required: true },
});
</script>
