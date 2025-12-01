<template>
  <div class="navbar bg-neutral/80">
    <div class="flex-none text-white">
      <BackButton :customAction="goHome" />
    </div>
    <div class="flex-1"></div>

    <div class="dropdown dropdown-end relative">
      <button
        tabindex="0"
        role="button"
        class="icon-btn btn-circle btn-sm"
        aria-label="Menú"
      >
        <ui-icon
          name="outline:ellipsis-vertical"
          class="w-5 h-5 pointer-events-none"
        />
      </button>
      <ul
        tabindex="0"
        class="dropdown-content menu app-menu bg-base-100 rounded-xs z-1"
      >
        <li>
          <NuxtLink to="/general">Configuración General</NuxtLink>
        </li>
        <!-- Show ThemeController in its original position except on the /ingreso page -->
        <li class="px-2" v-if="route.path !== '/ingreso'">
          <ThemeController />
        </li>
        <li><a>Salir</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import ThemeController from "./ui/ThemeController.vue";
import BackButton from "./ui/buttons/BackButton.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const goHome = () => router.push("/");
</script>

// IconButton import removed as we're using a plain button now

<style scoped>
/* Removed per global .app-menu standardization */
</style>
