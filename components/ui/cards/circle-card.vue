<template>
  <div class="flex flex-col justify-between">
    <img
      class="mask mask-circle w-48 md:w-64 h-48 md:h-64 mb-0 md:mb-2 mt-6"
      :src="image"
      :alt="nombre"
    />

    <div
      class="flex flex-col text-center md:text-left p-4 text-sm md:text-base"
    >
      <h3 class="font-bold">{{ nombre }}</h3>
      <span class="hidden md:block">Artista</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
  nombre: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },
});
const router = useRouter();

function goToArtist(link: string) {
  // Navegando a enlace
}
</script>
