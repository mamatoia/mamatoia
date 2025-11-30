<template>
  <section :class="['px-4 pt-3 pb-0 -mt-2 relative z-10 text-left', bgClass]">
    <h2 class="text-lg font-semibold leading-none pb-0">
      <div class="flex items-start gap-4">
        <span
          :class="[
            'relative inline-block leading-none pb-4 cursor-pointer select-none transition-colors text-left',
            textClass || '!text-base-content',
          ]"
          @click="$emit('label-click')"
        >
          <span
            :class="['absolute left-0 bottom-0 h-1 w-full', underlineClass]"
            aria-hidden="true"
          ></span>
          {{ label }}
        </span>
        <slot name="tabs" />
      </div>
    </h2>

    <div v-if="controls" class="mt-3">
      <slot>
        <label
          class="input input-bordered flex items-center gap-2 w-full max-w-md"
        >
          <ui-icon name="outline:magnifying-glass" class="w-5 h-5 opacity-70" />
          <input
            type="text"
            class="grow"
            :placeholder="placeholder"
            :value="modelValue"
            @input="
              $emit(
                'update:modelValue',
                ($event.target as HTMLInputElement).value
              )
            "
          />
        </label>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    modelValue?: string;
    placeholder?: string;
    bgClass?: string;
    controls?: boolean;
    underlineClass?: string;
    textClass?: string;
  }>(),
  {
    label: "Filtrar",
    modelValue: "",
    placeholder: "Buscar…",
    bgClass: "bg-base-100",
    controls: false,
    underlineClass: "bg-primary",
    textClass: "",
  }
);

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "label-click"): void;
}>();
</script>
