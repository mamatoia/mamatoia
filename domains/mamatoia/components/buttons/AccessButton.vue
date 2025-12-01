<template>
  <button :class="computedClass" :disabled="disabled" @click="$emit('click')">
    <UiIcon :name="resolvedIcon" class="w-5 h-5 flex-shrink-0" />
    <span class="whitespace-nowrap">
      <slot>{{ textToShow }}</slot>
    </span>
  </button>
</template>
<script setup lang="ts">
import UiIcon from "~/components/ui/Icon.vue";

interface Props {
  variant?: "entry" | "exit";
  text?: string;
  icon?: string;
  disabled?: boolean;
  classOverride?: string;
}
const props = defineProps<Props>();

const variant = props.variant || "entry";
const disabled = props.disabled || false;

const textToShow = computed(() => {
  if (props.text) return props.text;
  return variant === "entry" ? "INGRESAR" : "SALIR";
});

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon;
  return variant === "entry"
    ? "heroicons:arrow-right-on-rectangle"
    : "heroicons:arrow-left-on-rectangle";
});

const baseClasses =
  "btn btn-md w-50 max-w-xs mx-auto flex items-center justify-center gap-2 text-sm font-semibold border-2 shadow-lg";
const entryClasses = "bg-white text-gray-800 hover:bg-gray-100 border-white";
const exitClasses =
  "bg-black/40 text-white hover:bg-black/50 border-white backdrop-blur-sm";

const computedClass = computed(() => {
  if (props.classOverride) return props.classOverride;
  return [baseClasses, variant === "entry" ? entryClasses : exitClasses].join(
    " "
  );
});

defineEmits(["click"]);
</script>
