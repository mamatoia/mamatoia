<template>
  <template>
    <div class="flex items-center justify-center min-h-screen bg-base-100">
      <h1 class="text-3xl font-bold text-primary">Hola Mundo</h1>
    </div>
  </template>
</template>

<script setup>
import PaseshowHome from "~/paseshow/views/PaseshowHome.vue";

useHead({ title: "Publipaq - Sistema de Tickets" });

definePageMeta({
  layout: "single-paseshow-noheader",
});
</script>
