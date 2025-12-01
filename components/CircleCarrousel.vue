<template>
  <div class="carousel carousel-center space-x-4 p-4">
    <div
      v-for="(artista, index) in artistas"
      :key="index"
      class="carousel-item group relative"
    >
      <CircleCard
        :nombre="artista.nombre"
        :image="artista.image"
        :link="artista.link"
        :showPlayButton="showPlayButton"
      />
      <div
        v-if="showPlayButton"
        class="absolute justify-end right-0 bottom-15 space-x-2 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <UiButtonsButtonplay @click="goToArtist(artista.link)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import CircleCard from "@/components/ui/cards/circle-card.vue";
import { useRouter } from "vue-router";
import UiButtonsButtonplay from "@/components/ui/buttons/buttonplay.vue";

const props = defineProps({
  artistas: {
    type: Array,
    default: () => [],
  },
  showPlayButton: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

function goToArtist(link: string) {
  router.push(link);
}
</script>
