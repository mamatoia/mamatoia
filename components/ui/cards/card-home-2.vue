<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content flex-col justify-center">
      <img :src="props.image" class="max-w-sm rounded-lg shadow-2xl" />
      <div class="text-center">
        <h1 class="text-2xl md:text-5xl font-bold">{{ props.title }}</h1>
        <p class="py-6 text-center">
          {{ props.description }}
        </p>
        <UiButtonLink :to="buttonLink" :variant="buttonVariant">
          {{ buttonText }}
        </UiButtonLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";
import UiButtonLink from "@/components/ui/buttons/button-link.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Box Office News!",
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
    default: "Get Started",
  },
  buttonLink: {
    type: String,
    default: "/about",
  },
  buttonVariant: {
    type: String,
    default: "btn-info",
  },
});
</script>
