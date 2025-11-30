<template>
  <Iconify :icon="resolvedName" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Icon as Iconify } from "@iconify/vue";

const props = defineProps<{ name?: string }>();

const resolvedName = computed(() => {
  const name = props.name || "";
  if (!name) return "";
  if (name.startsWith("solid:") || name.startsWith("outline:")) {
    return `heroicons-${name}`;
  }
  return name;
});
</script>
