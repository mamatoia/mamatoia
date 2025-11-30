<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
// Página vacía para captar cualquier `/json/*` y evitar warnings del router
definePageMeta({ ssr: false });
</script>
