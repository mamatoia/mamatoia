<template>
  <div class="flex flex-col space-x-2 flex-1">
    <!-- Campo de búsqueda -->
    <label class="input w-64 md:w-96">
      <ui-icon name="solid:search" class="w-5 h-5 text-gray-500" />
      <input
        type="search"
        class="grow"
        placeholder="¿Qué quieres reproducir?"
        v-model="query"
        @input="handleInput"
      />
    </label>

    <!-- Resultados de búsqueda -->
    <div class="relative">
      <ui-listbox
        v-show="mostrarResultados"
        class="w-96 list absolute z-50 left-0 top-0"
        v-slot="data"
        :lines="5"
        :line-height="5"
        ref="listbox"
        :options="resultadosFiltrados"
        @close="terminarBusqueda"
        v-model="selectedValue"
      >
        <ui-item-list-default
          class="cursor-default"
          :selected="data.selected"
          :artista="data.option.value"
        />
      </ui-listbox>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useArtistStore } from "~/src/stores/music/artist";

const emit = defineEmits(["close"]);
// Referencias y estado
const mostrarResultados = ref(false);
const query = ref("");
const selectedValue = ref("");

// Obtener artistas desde el store
const artistStore = useArtistStore();

const resultadosFiltrados = computed(() =>
  artistStore.filtrarArtistasPorNombre(query.value)
);

// Manejar la entrada del usuario
const handleInput = () => {
  mostrarResultados.value = query.value.length > 0;
};

// Terminar la búsqueda
const terminarBusqueda = () => {
  emit("close", selectedValue.value);
  mostrarResultados.value = false;
  query.value = "";
};
</script>
