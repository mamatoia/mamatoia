<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pb-0">
    <ui-cards-card-home1
      title="Haz tu lista!"
      description="con tus artistas favoritos"
      image="/images/imagen-home-01.webp"
      buttonText="Ahora!"
      buttonLink="/accounts/contact"
      buttonVariant="btn-outline btn-warning"
    />
    <ui-cards-card-home2
      title="Noticia 2"
      description="Esta es la descripción de la noticia 2."
      image="/images/imagen-home-01.webp"
      buttonText="Leer Más"
      buttonLink="/accounts/contact"
      buttonVariant="btn-secondary"
    />
  </div>
</template>
<script setup>
import CardHome1 from "@/components/ui/cards/card-home-1.vue";
import CardHome2 from "@/components/ui/cards/card-home-2.vue";
</script>
