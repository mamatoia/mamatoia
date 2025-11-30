# pages

Esta carpeta solo debe contener archivos `.vue` que importan y muestran una view desde la carpeta `views/`.

**No** debe haber lógica, componentes, ni stores aquí. Solo sirve como punto de entrada para el enrutamiento de Nuxt.

Ejemplo:

```vue
<script setup>
import HomeView from "~/views/HomeView.vue";
</script>
<template>
  <HomeView />
</template>
```
