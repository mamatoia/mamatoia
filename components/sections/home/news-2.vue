<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pb-0">
    <ui-cards-card-home2
      title="Noticia 3"
      description="Esta es la descripción de la noticia 3."
      image="/images/imagen-home-01.webp"
      buttonText="Leer Más"
      buttonLink="/accounts/contact"
      buttonVariant="btn-warning"
    />
    <ui-cards-card-home1
      title="Noticia 4"
      description="Esta es la descripción de la noticia 4."
      image="/images/imagen-home-01.webp"
      buttonText="Leer Más"
      buttonLink="/about"
      buttonVariant="btn-outline btn-secondary"
    />
  </div>
</template>
<script setup>
import CardHome1 from "@/components/ui/cards/card-home-1.vue";
import CardHome2 from "@/components/ui/cards/card-home-2.vue";
</script>
