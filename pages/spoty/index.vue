<template>
  <div>
    <sections-home-welcome />
    <sections-home-news1 />
    <sections-home-news2 />
    <Carrusel
      :images="imagen"
      class-item="h-80"
      md:height="h-96"
      :showPlayButton="false"
    />
  </div>
</template>
<script lang="ts" setup>
import Carrusel from "@/components/sections/home/carrusel.vue";

const imagen = [
  { src: "/images/imagen-laracampos.jpg" },
  { src: "/images/imagen-radiohead.jpg" },
  { src: "/images/imagen-thepolice.jpg" },
  { src: "/images/imagen-thebeatles.jpg" },
  { src: "/images/imagen-theclash.jpg" },
  { src: "/images/imagen-thedoors.jpg" },
  { src: "/images/imagen-u2.jpg" },
];
</script>
