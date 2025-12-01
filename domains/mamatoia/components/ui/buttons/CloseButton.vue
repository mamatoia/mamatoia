<template>
  <button
    class="p-1 text-base-content/80 bg-transparent hover:bg-transparent active:bg-transparent focus:outline-none focus:ring-0 select-none shrink-0"
    style="-webkit-tap-highlight-color: transparent"
    @click="close"
    aria-label="Cerrar"
  >
    <ui-icon name="outline:x-mark" class="w-6 h-6 pointer-events-none" />
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const close = () => {
  router.back();
};
</script>
