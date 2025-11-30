<template>
  <div class="relative">
    <div class="">
      <div
        tabindex="0"
        role="button"
        ref="button"
        class="btn m-1"
        @click="toggleDropdown"
        @keypress.space="toggleDropdown"
      >
        <ui-icon name="solid:list-bullet" class="w-4 h-8" />
      </div>
    </div>

    <ui-listbox
      ref="listBox"
      class="absolute z-50"
      v-if="listboxOpen"
      v-model="selectedValue"
      :options="options"
      @close="handleClose"
    />
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
