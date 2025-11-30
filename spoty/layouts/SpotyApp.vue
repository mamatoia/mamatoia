<template>
  <CoolTemplate>
    <template #header><Header /></template>

    <template #sidebar><Sidebar /></template>

    <slot />
    <template #footer><Footer /></template>
  </CoolTemplate>
</template>

<script setup lang="ts">
import CoolTemplate from "./components/CoolTemplate.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Sidebar from "../widgets/Sidebar.vue";
</script>
