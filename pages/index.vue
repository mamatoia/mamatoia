<template>
  <PaseshowHome />
</template>

<script setup>
import PaseshowHome from "~/paseshow/views/PaseshowHome.vue";

useHead({ title: "Publipaq - Sistema de Tickets" });

definePageMeta({
  layout: "single-paseshow-noheader",
});
</script>
