# views

Cada archivo en esta carpeta representa una vista principal de la aplicación (pantalla o sección).

Las views se arman usando panels. No deben contener lógica de negocio ni stores directamente, solo organizar panels.

Ejemplo:

```vue
<script setup>
import HomePanel from "~/panels/HomePanel.vue";
</script>
<template>
  <HomePanel />
</template>
```
