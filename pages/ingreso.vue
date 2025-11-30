<template>
  <Login />
</template>
<script setup>
import Login from "~/paseshow/views/Login.vue";
definePageMeta({
  layout: "single-paseshow",
  middleware: ["auth-paseshow"],
});
</script>
