<template>
  <nuxt-link :to="to" class="btn" :class="variant" :target="target" :rel="rel">
    <slot />
  </nuxt-link>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  to: {
    type: String,
    required: true, // El enlace es obligatorio
  },
  variant: {
    type: String,
    default: "btn-primary", // Clase predeterminada de DaisyUI
  },
  target: {
    type: String,
    default: "_self", // Comportamiento del enlace (_self, _blank, etc.)
  },
  rel: {
    type: String,
    default: null, // Relación del enlace (por ejemplo, "noopener noreferrer")
  },
});
</script>
