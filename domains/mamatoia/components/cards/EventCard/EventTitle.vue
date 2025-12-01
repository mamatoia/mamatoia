<template>
  <div class="flex-1 font-semibold text-lg pl-3">{{ titleCase }}</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const titleCase = computed(() =>
  props.text
    ? props.text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : ""
);
</script>
