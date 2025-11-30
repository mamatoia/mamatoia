<template>
  <div
    class="flex flex-row-reverse md:flex-row sm:items-center justify-between p-4 bg-primary"
  >
    <div class="flex items-center space-x-4 flex-1">
      <nuxt-link
        href="/"
        class="hidden md:flex items-center space-x-2 text-primary"
      >
        <ui-icon name="sn:spotify" class="w-10 h-10" />
      </nuxt-link>

      <Buscador @close="handleArtistSelection" />
    </div>

    <div class="flex items-center space-x-4">
      <button class="btn hidden sm:flex">
        <ui-icon name="outline:arrow-down-circle" class="w-5 h-5" />Instalar app
      </button>

      <a href="#" class="hidden sm:flex items-center space-x-2">
        <ui-icon name="outline:bell" class="w-5 h-5" />
      </a>

      <details class="dropdown dropdown-start md:dropdown-end">
        <summary class="btn btn-circle bg-secondary m-2">AI</summary>
        <ul
          class="menu dropdown-content bg-base-200 rounded-field w-40 p-2 shadow-sm"
        >
          <li>
            <NuxtLink
              to="/accounts/overview"
              class="flex justify-between link link-hover"
              >Cuenta<ui-icon
                name="outline:arrow-top-right-on-square"
                class="w-5 h-5 self-end"
            /></NuxtLink>
          </li>
          <li><a>Cierra sesión</a></li>
        </ul>
      </details>

      <ui-theme-controller class="hidden sm:inline-flex" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Buscador from "@/components/Buscador.vue";

const router = useRouter(); // Declarado al nivel superior

const avatarUrl = "";
const searchQuery = ref("");

// Maneja el cierre del buscador
const handleClose = (query) => {
  searchQuery.value = query;
  // Búsqueda realizada
};

// Maneja la selección de un artista
const handleArtistSelection = (artista) => {
  if (artista && artista.codigo) {
    router.push(`/artista/${artista.codigo}`);
  }
};
</script>
