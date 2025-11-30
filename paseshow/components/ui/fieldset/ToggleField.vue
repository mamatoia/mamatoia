<template>
  <div class="flex items-center justify-between w-full px-6 mb-4">
    <label :class="['text-base-content font-semibold m-0', labelClass]">
      {{ label }}
    </label>
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :class="toggleClass"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
  labelClass: { type: String, default: "text-sm" },
  toggleClass: { type: String, default: "" },
});
defineEmits(["update:modelValue"]);
</script>
