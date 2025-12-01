<template>
  <div class="navbar">
    <div class="flex-1 flex flex-col items-start">
      <a class="btn btn-ghost text-2xl">Spoty</a>
      <button class="btn btn-soft" @click="$emit('filtrar')">Artistas</button>
    </div>
    <div class="flex-none flex items-center">
      <div class="dropdown dropdown-hover">
        <div tabindex="0" role="button" class="btn btn-primary">
          <ui-icon name="outline:plus" class="w-5 h-5" /> Crear
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu app-menu bg-base-100 rounded-box z-1"
        >
          <li class="flex items-start" @click="manejarCreacionDeLista">
            <div class="list-row">
              <div class="mask mask-circle w-10 h-10 bg-base-200">
                <ui-icon name="outline:plus-circle" class="w-6 h-6 ml-2 mt-2" />
              </div>
              <div class="list-col">
                <div class="text-xs uppercase font-bold text-start">Lista</div>
                <div>Crea una lista con canciones</div>
              </div>
            </div>
          </li>
          <li class="flex items-start">
            <div class="list-row">
              <div class="mask mask-circle w-10 h-10 bg-base-200">
                <ui-icon name="outline:folder" class="w-6 h-6 ml-2 mt-2" />
              </div>
              <div class="list-col">
                <div class="text-xs uppercase font-bold text-start">
                  Carpeta
                </div>
                <div>Organiza tus listas</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <ui-dropdown
        v-model="orden"
        :options="[
          { label: 'asc', value: 'asc' },
          { label: 'desc', value: 'desc' },
        ]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";
import { useRouter } from "vue-router";
import { useArtistStore } from "~/src/stores/music/artist";

const emit = defineEmits(["update:modelValue", "filtrar"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "asc",
  },
});

const orden = computed({
  get: () => props.modelValue,
  set: (value: String) => emit("update:modelValue", value),
});

// Router para redirigir al usuario
const router = useRouter();

// Store para manejar las listas
const artistStore = useArtistStore();

// Función para crear una nueva lista
const manejarCreacionDeLista = () => {
  const nombreLista = "Nueva Lista"; // Nombre predeterminado para la nueva lista
  artistStore.agregarLista(nombreLista); // Llama a la acción del store para crear la lista
  router.push(`/lista/${nombreLista}`); // Redirige a la página dinámica
};
</script>
