<template>
  <div class="card bg-base-100 w-1/3 md:w-80 relative group">
    <figure>
      <img :src="image" alt="Imagen del artista" />
    </figure>
    <div class="card-body p-2 md:p-5">
      <h2
        class="card-title flex justify-center text-center md:justify-start md:text-start text-sm md:text-base"
      >
        {{ nombre }}
      </h2>
      <p class="hidden md:block">
        {{ canciones }}
      </p>
      <div
        v-if="showPlayButton"
        class="justify-end right-0 bottom-0 absolute space-x-2 p-4 pb-34 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <UiButtonsButtonplay @click="goToArtist(link)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import UiButtonsButtonplay from "@/components/ui/buttons/buttonplay.vue";

const props = defineProps({
  nombre: {
    type: String,
    default: "Lara Campos",
  },
  canciones: {
    type: String,
    default: `Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
              id nisi.`,
  },
  image: {
    type: String,
    default: "/images/imagen-laracampos.jpg",
  },
  showPlayButton: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    required: true,
  },
});
const router = useRouter();

function goToArtist(link: string) {
  router.push(link);
}
</script>
