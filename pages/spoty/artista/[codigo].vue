<template>
  <div>
    <div class="card lg:card-side bg-base-100 h-52 rounded-b-none">
      <figure>
        <img :src="artistaActual?.imagen" alt="Album" />
      </figure>

      <div class="card-body bg-linear-to-t to-warning">
        <div class="flex items-center space-x-2">
          <UiIcon name="solid:check-badge" class="w-8 h-8 text-info" />
          <span class="font-bold">Artista Verificado</span>
        </div>
        <h2 class="card-title text-7xl font-extrabold">
          {{ artistaActual?.nombre }}
        </h2>
        <p class="p-4">Muchísimos oyentes mensuales</p>
      </div>
    </div>
    <section>
      <Tabla
        :artista="artistaActual?.nombre"
        :canciones="artistaActual?.canciones"
        :imagen="artistaActual?.imagen"
      />
    </section>
    <div>
      <PieEnlaces class="hidden sm:block" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { useRoute } from "vue-router";
import { useArtistStore } from "~/src/stores/music/artist";

definePageMeta({
  layout: "app-spoty",
});

const props = defineProps({
  image: {
    type: String,
    default: "/images/imagen-about-1.webp",
  },
});

const route = useRoute();

const artistStore = useArtistStore();
const code = route.params.codigo as string;
const artistaActual = computed(() => artistStore.getArtistByCode(code));
</script>
