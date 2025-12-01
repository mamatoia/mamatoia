<template>
  <button class="icon-btn" @click="handleClick" aria-label="Volver">
    <UiIcon name="outline:chevron-left" class="w-6 h-6 pointer-events-none" />
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import UiIcon from "@/components/ui/Icon.vue";

const router = useRouter();

const props = defineProps({
  // Permite customizar el comportamiento del botón
  customAction: {
    type: Function,
    default: null,
  },
});

const handleClick = () => {
  if (props.customAction) {
    props.customAction();
  } else {
    router.back();
  }
};
</script>
