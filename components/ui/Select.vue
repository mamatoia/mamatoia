<template>
  <div class="relative">
    <div class="">
      <div
        tabindex="0"
        role="button"
        ref="button"
        class="btn m-1"
        @click="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.down.prevent="toggleDropdown"
      >
        <input
          type="text"
          :value="
            options.find((option) => option.value === selectedValue)?.label
          "
          class="w-full p-2 border border-gray-300 rounded"
          readonly
        />
        <ui-icon name="solid:list-bullet" class="w-4 h-8" />
      </div>
    </div>

    <ui-listbox
      ref="listBox"
      class="absolute z-50 w-full"
      v-if="listboxOpen"
      v-model="selectedValue"
      :options="options"
      @onclose="handleClose"
      v-slot="data"
    >
      <div class="cursor-default text-sm p-2">{{ data.option.label }}</div>
    </ui-listbox>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  nextTick,
  defineProps,
  defineEmits,
  watch,
  useTemplateRef,
} from "vue";

type Option = {
  label: string;
  value: string;
};

const props = defineProps({
  options: {
    type: Array<Option>,
    default: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" },
    ] as Option[],
  },
  modelValue: {
    type: String,
  },
});

const selectedValue = ref(props.modelValue);

const emit = defineEmits(["update:modelValue", "onchange", "onclose"]);

const listboxOpen = ref(false);
const listBox = useTemplateRef("listBox");

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);

watch(
  () => selectedValue.value,
  (newValue) => {
    emit("update:modelValue", newValue);
    emit("onchange", newValue);
  }
);

const button = useTemplateRef("button");
function handleClose() {
  listboxOpen.value = false;

  nextTick(() => {
    button.value?.focus();
  });
}

function toggleDropdown() {
  listboxOpen.value = !listboxOpen.value;

  nextTick(() => {
    if (listboxOpen.value) {
      const listBoxElement = listBox.value;
      listBoxElement?.$el.focus();
    }
  });
}
</script>
