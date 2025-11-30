<template>
  <div>
    <hr class="my-4" />
    <ui-listbox class="w-96 list" v-slot="data" :lines="5" :line-height="5">
      <ui-item-list-default
        class="p-2 cursor-default"
        :artista="{
          nombre: data.option.label,
          imagen: 'https://picsum.photos/200/300?random=' + data.index,
          cancion: 'Cancion ' + data.index,
          codigo: data.option.value,
        }"
      />
    </ui-listbox>
    <div class="flex w-full justify-around">
      <ui-select v-model="value" class="max-w-xs" />

      <ui-listbox class="w-96 h-96" v-slot="data">
        <div class="cursor-default text-sm p-2">{{ data.option.label }}</div>
      </ui-listbox>
    </div>

    <button class="btn btn-primary btn-ghost btn-sm" @click="value = ''">
      Reset
    </button>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "app-spoty",
});

import { ref } from "vue";
const value = ref("");
</script>
