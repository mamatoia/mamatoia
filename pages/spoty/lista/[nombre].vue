<template>
  <div>
    <main class="flex-1 p-4">
      <div class="card-body bg-linear-to-t to-warning">
        <div class="flex items-center space-x-2">
          <input
            v-model="listaActual.nombre"
            class="card-title text-7xl font-extrabold"
            placeholder="Nombre de la lista"
            @keyup.enter="guardarCambios"
          />
          <button class="btn btn-primary ml-4" @click="guardarCambios">
            Guardar
          </button>
        </div>
      </div>

      <ul class="space-y-2">
        <li
          v-for="(cancion, index) in listaActual.canciones"
          :key="index"
          class="flex items-center justify-between p-2 bg-base-100 rounded"
        >
          <span>{{ cancion.artista }} - {{ cancion.cancion }}</span>
          <button class="btn btn-xs btn-error" @click="eliminarCancion(index)">
            Eliminar
          </button>
        </li>
      </ul>

      <div class="mt-4">
        <h3 class="text-lg font-bold mb-2">Encontraremos algo para tu lista</h3>
        <div class="flex items-center space-x-2">
          <!-- Componente de Buscador -->
          <Buscador
            v-model="busqueda"
            placeholder="Buscar canciones"
            @seleccionar="seleccionarCancion"
          />
          <button class="btn btn-primary" @click="agregarCancion">
            Agregar
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useArtistStore } from "~/src/stores/music/artist";
import Sidebar from "~/paseshow/widgets/Sidebar.vue";

import Buscador from "@/components/Buscador.vue"; // Importa el componente de buscador
import { ref, computed } from "vue";

definePageMeta({
  layout: "app-spoty",
});

const route = useRoute();
const router = useRouter();
const artistStore = useArtistStore();

// Obtener el nombre de la lista desde la URL
const nombreLista = route.params.nombre as string;

// Buscar la lista correspondiente en el store
const listaActual = computed(() =>
  artistStore.listas.find((lista) => lista.nombre === route.params.nombre)
);

// Si no existe la lista, redirigir al usuario
if (!listaActual.value) {
  router.push("/lista");
}

// Estado para el buscador
const busqueda = ref("");
const cancionSeleccionada = ref(null);

// Función para manejar la selección de una canción desde el buscador
const seleccionarCancion = (cancion) => {
  cancionSeleccionada.value = cancion;
};

// Función para agregar la canción seleccionada a la lista
const agregarCancion = () => {
  if (cancionSeleccionada.value) {
    listaActual.value.canciones.push(cancionSeleccionada.value);
    cancionSeleccionada.value = null; // Limpia la selección
    busqueda.value = ""; // Limpia el campo de búsqueda
  }
};

// Función para eliminar una canción de la lista
const eliminarCancion = (index: number) => {
  listaActual.value.canciones.splice(index, 1);
};

// Función para guardar los cambios (opcional, si necesitas persistencia)
const guardarCambios = () => {
  if (listaActual.value) {
    const nombreAnterior = route.params.nombre as string;
    const nuevoNombre = listaActual.value.nombre;

    // Actualiza el nombre de la lista en el store
    artistStore.actualizarNombreLista(nombreAnterior, nuevoNombre);

    // Cambia la ruta si el nombre ha cambiado
    if (nombreAnterior !== nuevoNombre) {
      router.push(`/lista/${encodeURIComponent(nuevoNombre)}`);
    }

    alert("Cambios guardados");
  }
};
</script>
