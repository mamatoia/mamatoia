<template>
  <button
    class="btn btn-circle btn-primary shadow-lg btn-lg"
    @click="$emit('click')"
    :aria-label="label"
  >
    <UiIcon name="heroicons:trash" class="w-7 h-7 text-white" />
  </button>
</template>

<script setup>
import UiIcon from "~/components/ui/Icon.vue";
defineProps({
  label: { type: String, default: "Limpiar ticket" },
});

defineEmits(["click"]);
</script>

<style scoped>
button {
  color: white !important;
}
button :deep(svg) {
  color: white !important;
  stroke: white !important;
}
</style>
