<template>
  <div class="flex flex-row items-center w-full space-x-4">
    <input
      type="checkbox"
      id="checkbox"
      class="checkbox validator btn-square border border-base-content"
      v-model="checked"
    />
    <label for="checkbox" class="text-sm text-neutral-content pt-8">
      <slot />
    </label>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const checked = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
