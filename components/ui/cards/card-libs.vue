<template>
  <div class="flex justify-between list-row hover:bg-base-200">
    <nuxt-link :to="`/artista/${codigo}`" class="flex items-center space-x-4">
      <div><img class="size-10 rounded-box" :src="imagen" /></div>
      <div class="hidden md:block">
        <div>{{ nombre }}</div>
        <div class="text-xs uppercase font-semibold opacity-60">
          {{ cancion }}
        </div>
      </div>
    </nuxt-link>

    <div class="flex justify-end">
      <button class="btn btn-square btn-ghost">
        <ui-icon name="outline:play" class="w-5 h-5" />
      </button>
      <button class="btn btn-square btn-ghost">
        <ui-swap-icon name="outline:heart" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
  codigo: {
    type: String,
    default: "xxxx",
  },
  nombre: {
    type: String,
    default: "Clara",
  },
  cancion: {
    type: String,
    default: `Creep`,
  },
  imagen: {
    type: String,
    default: "/images/imagen-home-01.webp",
  },
});
</script>
