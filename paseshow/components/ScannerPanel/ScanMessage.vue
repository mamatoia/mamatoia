<template>
  <ClearButton
    v-if="message && showButton"
    class="absolute bottom-12 right-3 z-[60]"
    @click="$emit('clear')"
  />
</template>

<script setup>
import ClearButton from "~/paseshow/components/ui/buttons/ClearButton.vue";

defineProps({
  message: { type: String, default: "" },
  color: { type: String, default: "" },
  showButton: { type: Boolean, default: true },
});
defineEmits(["clear"]);
</script>

<style scoped></style>
