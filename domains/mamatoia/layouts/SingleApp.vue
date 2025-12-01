<template>
  <FullVertical>
    <template v-if="!isGeneralPage" #header><Header /></template>
    <slot />
  </FullVertical>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import FullVertical from "../panels/FullVertical.vue";
import Header from "../components/Header.vue";

const route = useRoute();
const isGeneralPage = computed(() => route.path === "/general");
</script>
