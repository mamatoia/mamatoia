<template>
  <div>
    <h2>Bienvenido {{ user?.name }}</h2>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/src/stores/auth";
import authMiddleware from "~/middleware/auth/spotify";

definePageMeta({
  layout: "app-paseshow",
  middleware: [authMiddleware],
});

const authStore = useAuthStore();

const user = authStore.user;

onBeforeMount(() => {
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname);
    navigateTo("/home");
  }
});
</script>
