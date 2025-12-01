<template>
  <div :class="['w-full max-w-xs rounded-sm p-8', bgClass]">
    <div class="grid gap-6 place-items-center">
      <slot />
    </div>
  </div>
</template>

<script setup>
import ThemeController from "../components/ui/ThemeController.vue";
const props = defineProps({
  bgClass: {
    type: String,
    default: "bg-neutral/80",
  },
});
</script>
