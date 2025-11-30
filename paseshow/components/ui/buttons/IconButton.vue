<template>
  <button
    :class="[
      'btn btn-circle btn-sm border-0 shadow-none flex items-center justify-center transition-colors',
      selected
        ? 'bg-primary text-primary-content'
        : 'bg-transparent text-current',
    ]"
    v-bind="$attrs"
    :aria-pressed="selected ? 'true' : 'false'"
    :aria-label="label"
  >
    <ui-icon
      v-if="icon"
      :name="icon"
      :class="['w-5 h-5', selected ? onClass : offClass]"
    />
    <slot v-else />
    <span
      v-if="label"
      class="ml-1 text-xs"
      :class="selected ? 'text-primary-content' : ''"
      >{{ label }}</span
    >
  </button>
</template>

<script setup>
const props = defineProps({
  label: String,
  icon: String,
  selected: { type: Boolean, default: false },
  // classes applied to the icon when selected / not selected
  onClass: { type: String, default: "text-current" },
  offClass: { type: String, default: "text-white" },
});
</script>
