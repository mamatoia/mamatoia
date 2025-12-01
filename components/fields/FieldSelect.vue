<template>
  <div class="flex flex-col w-full px-6 mb-4">
    <label
      :class="['text-base-content font-semibold text-left mb-1', labelClass]"
      >{{ label }}</label
    >
    <select
      class="select w-full bg-base-200 text-base-content border-base-content rounded-sm"
      :class="selectClass"
      v-model="value"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="bg-base-200 text-base-content hover:bg-primary hover:text-primary-content"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "Selecciona una opción",
  },
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
  labelClass: {
    type: String,
    default: "text-sm",
  },
  selectClass: {
    type: String,
    default: "text-sm",
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// No modal logic here; this component now renders a native select only.
</script>
