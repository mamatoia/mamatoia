<template>
  <div class="flex flex-col w-full mb-4 px-6">
    <label :class="['text-base-content font-semibold text-left', labelClass]">
      {{ label }}
    </label>
    <input
      :type="type"
      class="input w-full rounded-sm bg-base-200 text-base-content border-white"
      :placeholder="placeholder"
      :value="modelValue"
      :class="inputClass"
      @input="$emit('update:modelValue', $event.target.value)"
      autocomplete="off"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  type: { type: String, default: "text" },
  modelValue: { type: String, default: "" },
  inputClass: { type: String, default: "" },
  labelClass: { type: String, default: "text-sm" },
});
defineEmits(["update:modelValue"]);
</script>
