<template>
  <button
    class="icon-btn p-2 rounded-full transition-colors"
    aria-label="Buscar"
    @click="$emit('click')"
  >
    <UiIcon
      name="outline:magnifying-glass"
      class="w-6 h-6 pointer-events-none"
    />
  </button>
</template>

<script setup lang="ts">
import UiIcon from "@/components/ui/Icon.vue";

defineEmits(["click"]);
</script>
