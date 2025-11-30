<template>
  <div class="dock">
    <nuxt-link
      to="/side"
      exact-active-class="link-active"
      class="dock-button"
      :class="{ 'bg-base-300': $route.path === '/side' }"
    >
      <ui-icon name="outline:home" class="w-6 h-6" />
      <span class="dock-label">Side</span>
    </nuxt-link>

    <nuxt-link
      to="/accounts/contact"
      exact-active-class="link-active"
      class="dock-button"
      :class="{ 'bg-base-300': $route.path === '/accounts/contact' }"
    >
      <ui-icon name="outline:envelope-open" class="w-6 h-6" />
      <span class="dock-label">Contact</span>
    </nuxt-link>

    <nuxt-link
      to="/about"
      exact-active-class="link-active"
      class="dock-button"
      :class="{ 'bg-base-3100': $route.path === '/about' }"
    >
      <ui-icon name="outline:cog-6-tooth" class="w-6 h-6" />
      <span class="dock-label">About</span>
    </nuxt-link>
  </div>
</template>
