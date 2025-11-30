<template>
  <div>
    <div class="carousel carousel-center space-x-4 p-4">
      <div>
        <Carrusel
          :images="imagenes"
          class-item="h-48 md:h-96"
          :showPlayButton="true"
        />
      </div>
    </div>

    <div class="p-4">
      <h2
        class="text-3xl font-bold text-center flex justify-center md:justify-start"
      >
        Artistas Favoritos
      </h2>
      <CircleCarrousel :artistas="artistasConDetalles" :showPlayButton="true" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Carrusel from "@/components/sections/home/carrusel.vue";
import { useArtistStore } from "~/src/stores/music/artist";

const artistStore = useArtistStore();

const imagenes = artistStore.imagenesConEnlaces();

const artistasConDetalles = artistStore.artistasConDetalles();
</script>
