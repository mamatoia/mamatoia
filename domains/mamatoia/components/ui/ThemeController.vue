<template>
  <label class="toggle toggle-md text-base-content">
    <input
      type="checkbox"
      class="theme-controller"
      v-model="isGorillaz"
      aria-label="Cambiar tema"
    />

    <!-- Sun icon (day) -->
    <UiIcon
      name="heroicons:sun"
      class="w-5 h-5 text-yellow-400 sun-icon"
      aria-hidden="true"
    />

    <!-- Moon icon (night) -->
    <UiIcon
      name="heroicons:moon"
      class="w-5 h-5 text-indigo-300 moon-icon"
      aria-hidden="true"
    />
  </label>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import UiIcon from "~/components/ui/Icon.vue";

const THEME_KEY = "paseshow-theme";
// The theme name used for the night theme (uses DaisyUI's 'dark')
const GORILLAZ_THEME = "dark";
// The theme name used for the light theme
const LIGHT_THEME = "light";

const isGorillaz = ref(false);

const applyTheme = (theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
};

onMounted(() => {
  try {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
    // Default to the dark (gorillaz) theme unless the user has a saved preference
    const theme = saved || GORILLAZ_THEME;
    isGorillaz.value = theme === GORILLAZ_THEME;
    applyTheme(theme);
  } catch (e) {
    // ignore
  }
});

watch(isGorillaz, (val) => {
  const theme = val ? GORILLAZ_THEME : LIGHT_THEME;
  try {
    applyTheme(theme);
    if (typeof window !== "undefined") localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    // ignore
  }
});
</script>

<style scoped>
/* Small spacing tweak to keep the toggle aligned inside menus */
.theme-controller {
  margin: 0 0.375rem;
}

/* Show/hide icons according to the checkbox state. The input is inside
   the label, so we use the sibling selector to target the icons. */
.theme-controller:checked ~ .sun-icon {
  opacity: 0.35;
  transform: scale(0.95);
}
.theme-controller:checked ~ .moon-icon {
  opacity: 1;
  transform: scale(1);
}
.theme-controller:not(:checked) ~ .sun-icon {
  opacity: 1;
  transform: scale(1);
}
.theme-controller:not(:checked) ~ .moon-icon {
  opacity: 0.35;
  transform: scale(0.95);
}

.sun-icon,
.moon-icon {
  transition: opacity 160ms ease, transform 160ms ease;
}
</style>
