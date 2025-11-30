<template>
  <button
    class="btn btn-circle btn-outline text-base-content border-base-content w-64 md:w-xs flex items-center space-x-2"
  >
    <ui-icon :name="logo" class="h-5 w-5" />
    <span>{{ text }}</span>
  </button>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  logo: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
