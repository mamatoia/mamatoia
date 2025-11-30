<template>
  <!-- Thin wrapper to keep compatibility: delegate to paseshow buttons StackedButton -->
  <StackedButton v-bind="$attrs" />
</template>

<script setup>
import StackedButton from "~/paseshow/components/buttons/StackedButton.vue";
</script>

<style scoped>
/* wrapper has no additional styles */
</style>
