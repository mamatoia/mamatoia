<template>
  <Scanner />
</template>

<script setup>
import Scanner from "~/paseshow/views/Scanner.vue";

definePageMeta({
  layout: "app-paseshow",
  middleware: "auth-paseshow",
});
</script>
