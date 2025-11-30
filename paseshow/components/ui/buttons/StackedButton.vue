<template>
  <NuxtLink v-if="to" :to="to" class="block" :aria-label="ariaLabel">
    <div
      :class="[
        'overflow-hidden',
        widthClass,
        'text-white',
        'flex',
        'items-center',
        'justify-center',
        topBgClass,
      ]"
      :style="topStyle"
    >
      <UiIcon v-if="icon" :name="icon" class="icon-size" />
      <slot name="top" />
    </div>
    <div
      :class="[widthClass, bottomBgClass, 'text-center']"
      :style="bottomStyle"
    >
      <span class="text-xs">{{ label }}</span>
      <slot name="bottom" />
    </div>
  </NuxtLink>
  <button v-else type="button" class="block" :aria-label="ariaLabel">
    <div
      :class="[
        'overflow-hidden',
        widthClass,
        'text-white',
        'flex',
        'items-center',
        'justify-center',
        topBgClass,
      ]"
      :style="topStyle"
    >
      <UiIcon v-if="icon" :name="icon" class="icon-size" />
      <slot name="top" />
    </div>
    <div
      :class="[widthClass, bottomBgClass, 'text-center']"
      :style="bottomStyle"
    >
      <span class="text-xs">{{ label }}</span>
      <slot name="bottom" />
    </div>
  </button>
</template>

<script setup lang="ts">
import UiIcon from "~/components/ui/Icon.vue";
import { computed } from "vue";

const props = defineProps({
  to: { type: [String, Object], default: undefined },
  icon: { type: String, default: "" },
  label: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  widthClass: { type: String, default: "w-60" },
  topBgClass: { type: String, default: "bg-primary p-4 rounded-t-lg" },
  bottomBgClass: { type: String, default: "bg-primary/80 py-2 rounded-b-lg" },
  topStyle: { type: Object, default: () => ({}) },
  bottomStyle: { type: Object, default: () => ({}) },
});

// expose a class that can be used inside to size icon via CSS
const iconSizeClass = computed(() => "w-14 h-14");
</script>

<style scoped>
.icon-size {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
