<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content flex-col">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl md:text-5xl font-bold">{{ title }}</h1>
        <p class="py-3 md:py-6 text-center">
          {{ description }}
        </p>
        <UiButtonLink :to="buttonLink" :variant="buttonVariant">
          {{ buttonText }}
        </UiButtonLink>
      </div>

      <img :src="image" class="max-w-sm rounded-lg shadow-2xl" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { title } from "process";
import { defineProps, defineEmits, computed } from "vue";
import UiButtonLink from "@/components/ui/buttons/button-link.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Box Oficce News!",
  },
  description: {
    type: String,
    default: `Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.`,
  },
  image: {
    type: String,
    default: "/images/imagen-home-01.webp",
  },
  buttonText: {
    type: String,
    default: "Learn More",
  },
  buttonLink: {
    type: String,
    default: "/about",
  },
  buttonVariant: {
    type: String,
    default: "btn-primary",
  },
});
</script>
