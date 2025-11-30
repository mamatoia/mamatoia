<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <!-- Bloque swap: íconos superpuestos -->
    <span class="swap">
      <!-- Este checkbox controla el estado (oculto) -->
      <input
        type="checkbox"
        class="hidden"
        :checked="modelValue"
        @change="onChange"
        aria-label="toggle favorite"
      />

      <!-- Íconos configurables mediante props -->
      <UiIcon :name="iconOn" :class="['w-5 h-5 swap-on', onClass]" />
      <UiIcon :name="iconOff" :class="['w-5 h-5 swap-off', offClass]" />
    </span>

    <!-- Texto/área clickeable adicional -->
    <slot name="label">
      <span v-if="label" class="text-sm text-base-content/80">{{ label }}</span>
    </slot>
  </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from "vue";
import UiIcon from "@/components/ui/Icon.vue";

// Props para los íconos y estado controlado
const props = withDefaults(
  defineProps<{
    iconOn?: string;
    iconOff?: string;
    modelValue?: boolean; // para v-model
    label?: string; // texto opcional al lado del ícono
    onClass?: string; // clases extra para el ícono activo (solid)
    offClass?: string; // clases extra para el ícono inactivo (outline)
  }>(),
  {
    iconOn: "solid:heart",
    iconOff: "outline:heart",
    modelValue: false,
    onClass: "text-current",
    offClass: "text-white",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

function onChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  emit("update:modelValue", checked);
  emit("change", checked);
}
</script>
