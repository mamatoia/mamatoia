<template>
  <div class="carousel carousel-center space-x-4 p-4">
    <div
      v-for="(image, index) in images"
      :key="index"
      :class="['carousel-item', classItem, 'relative group']"
    >
      <img
        :src="image.src"
        alt="Imagen"
        class="w-full h-full object-cover rounded-lg"
      />

      <!-- Botón de Play -->
      <div
        v-if="showPlayButton"
        class="absolute justify-end right-0 bottom-0 space-x-2 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <UiButtonsButtonplay @click="goToArtist(image.link)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import UiButtonsButtonplay from "@/components/ui/buttons/buttonplay.vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => [
      "/images/imagen-home-1.jpg",
      "/images/imagen-home-2.jpg",
      "/images/imagen-home-3.jpg",
    ],
  },
  classItem: {
    type: String,
    default: "h-96",
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
