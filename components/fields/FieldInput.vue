<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">{{ label }}</legend>
    <input
      :type="type"
      class="input validator tabular-nums bg-base-200 text-neutral-content border-base-content p-2 rounded-sm"
      :placeholder="placeholder"
      :pattern="pattern"
      :minlength="minlength"
      :maxlength="maxlength"
      :required="required"
      :autocomplete="autocomplete"
      v-model="value"
    />
  </fieldset>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

// Props para personalizar el componente
const props = defineProps({
  label: {
    type: String,
    default: "", // Título del campo
  },
  type: {
    type: String,
    default: "text", // Tipo de entrada (por ejemplo, "text", "tel", "number")
  },
  placeholder: {
    type: String,
    default: "", // Texto del placeholder
  },
  pattern: {
    type: String,
    default: "", // Patrón de validación
  },
  minlength: {
    type: [String, Number],
    default: null, // Longitud mínima
  },
  maxlength: {
    type: [String, Number],
    default: null, // Longitud máxima
  },
  required: {
    type: Boolean,
    default: false, // Si el campo es obligatorio
  },
  autocomplete: {
    type: String,
    default: "off", // Configuración de autocompletado
  },
  modelValue: {
    type: String,
    default: "", // Valor inicial
  },
});

// Emitir cambios al componente padre
const emit = defineEmits(["update:modelValue"]);

// Manejo del valor seleccionado
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
