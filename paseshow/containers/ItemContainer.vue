<template>
  <div :class="['flex items-center rounded-xs', padClass, bgClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  bgClass: {
    type: String,
    default: "bg-base-100",
  },
  padClass: {
    type: String,
    default: "p-2",
  },
});
</script>
