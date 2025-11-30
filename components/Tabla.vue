<template>
  <div>
    <nav-tabla :artista="artista" />

    <div class="p-4 pb-2 text-2xl font-bold opacity-100 tracking-wide">
      Populares
      <ul class="list bg-base-100 rounded-box">
        <li
          v-for="(cancion, index) in canciones"
          :key="index"
          class="list-row"
          :class="{ 'bg-primary text-base-content': selectedIndex === index }"
          @click="selectSong(index)"
        >
          <div class="text-xl text-white font-normal opacity-100 tabular-nums">
            {{ formatIndex(index) }}
          </div>

          <div class="avatar">
            <div class="w-10 rounded">
              <img :src="imagen" alt="Imagen del artista" />
            </div>
          </div>

          <div class="list-col-grow mt-1">
            <div class="text-white font-semibold opacity-100">
              {{ cancion }}
            </div>
          </div>
          <button class="btn btn-square btn-ghost">
            <ui-icon name="outline:play" class="w-7 h-7" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavTabla from "@/components/ui/nav-tabla.vue";
import { defineProps } from "vue";
import { ref } from "vue";

const props = defineProps({
  canciones: {
    type: Array,
    default: ["René"],
  },
  artista: {
    type: String,
    default: "Artista Seleccionado",
  },
  imagen: {
    type: String,
    default: "",
  },
});

// Variable reactiva para rastrear la canción seleccionada
const selectedIndex = ref<number | null>(null);

// Función para seleccionar una canción
const selectSong = (index: number) => {
  selectedIndex.value = index;
};

const formatIndex = (index: number) => {
  return (index + 1).toString();
};
</script>
