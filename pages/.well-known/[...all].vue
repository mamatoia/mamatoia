<template>
  <div style="display:none"></div>
</template>

<script setup lang="ts">
// Página catch-all para `/.well-known/*` (p. ej. com.chrome.devtools.json)
// Evita que Vue Router muestre: "No match found for location with path \"/.well-known/...\""
// En modo desarrollo, registra información útil para diagnosticar el origen.
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Evitar spam excesivo: loguea solo la primera visita a esta ruta por sesión
  const key = '__well_known_logged'
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1')
    // Información mínima para identificar origen
    // eslint-disable-next-line no-console
    console.debug('[well-known catcher] referrer:', document.referrer, 'userAgent:', navigator.userAgent)
  }
}

definePageMeta({ ssr: false })
</script>
