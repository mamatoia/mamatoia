<template>
  <div>
    <div class="p-4">
      <h2 class="text-3xl font-bold text-center md:text-start">
        Tus artistas más escuchados
      </h2>
    </div>
    <div class="flex justify-around pt-6 px-2 gap-2 md:p-8">
      <UiCardsCardArtist
        nombre="Radiohead"
        image="/images/imagen-radiohead.jpg"
        canciones="Creep, Karma Police, No Surprises, Paranoid Android"
        :showPlayButton="true"
        link="/artista/radiohead"
      />
      <UiCardsCardArtist
        nombre="The Beatles"
        image="/images/imagen-thebeatles.jpg"
        canciones="Hey Jude, Let It Be, Yesterday, Come Together"
        :showPlayButton="true"
        link="/artista/thebeatles"
      />
      <UiCardsCardArtist
        nombre="U2"
        image="/images/imagen-u2.jpg"
        canciones="With Or Without You, One, Sunday Bloody Sunday, Beautiful Day"
        :showPlayButton="true"
        link="/artista/u2"
      />
    </div>
    <div class="p-4">
      <h2
        class="text-3xl font-bold text-center flex justify-center md:justify-start pt-4 md:p-0"
      >
        Vuelve a escuchar
      </h2>
    </div>

    <CarrouselFavoritos />
  </div>
</template>
<script setup lang="ts">
import CarrouselFavoritos from "~/spoty/widgets/CarrouselFavoritos.vue";
</script>
