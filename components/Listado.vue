<template>
  <div class="overscroll-contain overflow-auto">
    <ul class="list bg-base-100 rounded-box">
      <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Most played songs this week
      </li>

      <li
        v-for="(item, index) in cancionesDesglosadas"
        :key="`${item.artista.codigo}-${item.cancion}-${index}`"
      >
        <ItemList :artista="item.artista" :cancion="item.cancion" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, defineProps } from "vue";
import { useArtistStore } from "~/src/stores/music/artist";
import ItemList from "@/components/ui/ItemList.vue";

const props = defineProps({
  orden: {
    type: String,
    default: "asc",
  },
  filtro: {
    type: Boolean,
    default: false,
  },
});

const artistStore = useArtistStore();
const selectedArtist = ref("");

const artistasOrdenado = artistStore.listadoDeArtistas();

const selectArtist = (artistName) => {
  selectedArtist.value = artistName;
};
const cancionesDesglosadas = computed(() => {
  return artistStore.artists.flatMap((artista) =>
    artista.canciones.map((cancion) => ({
      cancion,
      artista: {
        nombre: artista.nombre,
        imagen: artista.imagen,
        codigo: artista.codigo,
      },
    }))
  );
});
</script>
