<template>
  <div class="flex h-full">
    <!-- Barra lateral reutilizada -->
    <aside class="w-1/4 bg-base-200 h-full">
      <Sidebar />
    </aside>

    <!-- Contenido principal -->
    <main class="flex-1 p-4">
      <h1 class="text-2xl font-bold mb-4">Mis Listas</h1>
      <div
        v-if="listas.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="(lista, index) in listas"
          :key="index"
          class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
        >
          <div class="card-body">
            <h2 class="card-title text-lg font-bold">{{ lista.nombre }}</h2>
            <p class="text-sm text-gray-500">
              {{ lista.canciones.length }} canciones
            </p>
            <nuxt-link
              :to="`/lista/${lista.nombre}`"
              class="btn btn-primary mt-4"
            >
              Ver Lista
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        <p>No tienes listas creadas aún.</p>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useArtistStore } from "~/src/stores/music/artist";
import Sidebar from "@/spoty/widgets/Sidebar.vue";

const artistStore = useArtistStore();

// Obtener las listas desde el store
const listas = artistStore.listas;
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}
</style>
