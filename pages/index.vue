<template>
  <PaseshowHome />
</template>

<script setup>
import PaseshowHome from "~/mamatoia/views/holaMundo.vue";

useHead({ title: "Publipaq - Sistema de Tickets" });

definePageMeta({
  layout: "single-paseshow-noheader",
});
</script>
