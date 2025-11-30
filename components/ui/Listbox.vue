<template>
  <ul
    ref="listbox"
    class="bg-base-200 overflow-y-auto shadow-xl"
    :style="{ maxHeight: `${props.lines * props.lineHeight}rem` }"
    @keydown.down.prevent="nextSelection()"
    @keydown.up.prevent="prevSelection()"
    @keydown.enter.prevent="handleClose()"
    tabindex="0"
  >
    <li class="p-7 pb-2 text-xs font-bold tracking-wide">
      Busquedas recientes
    </li>
    <li
      v-for="(option, index) in options"
      :key="index"
      class="z-1 w-full py-0.5"
      :class="{ 'bg-primary-content': selectedIndex === index }"
      ref="optionRefs"
      @mousedown="setSelection(index)"
      @mouseup="$emit('close')"
    >
      <slot
        :option="option"
        :index="index"
        :selected="selectedIndex === index"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { on } from "events";
import { ref, defineProps, defineEmits, watch } from "vue";

type Option = {
  label: string;
  value: string | object;
  disabled?: boolean;
};

const props = defineProps({
  name: {
    type: String,
    default: "listbox" + new Date().toISOString().replace(/[-:.]/g, ""),
  },
  lines: {
    type: Number,
    default: 5,
  },
  lineHeight: {
    type: Number,
    default: 2.5,
  },
  options: {
    type: Array<Option>,
    default: [
      { label: "Rick Springfield", value: "1" },
      { label: "Aerosmith", value: "2" },
      { label: "Radiohead", value: "3", disabled: true },
      { label: "The Beatles", value: "4" },
      { label: "The Rolling Stones", value: "5" },
      { label: "The Who", value: "6" },
      { label: "The Doors", value: "7" },
      { label: "The Eagles", value: "8" },
      { label: "The Beach", value: "9" },
      { label: "The Beach boys", value: "10" },
      { label: "John Waite", value: 11 },
    ] as Option[],
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "onchange", "close"]);

const selection = ref(props.modelValue);
const selectedIndex = ref(0);
const listbox = ref<HTMLElement | null>(null);
const optionRefs = ref<(HTMLElement | null)[]>([]);

const setSelection = (index: number) => {
  selectedIndex.value = index;
  selection.value = props.options[index].value as string;
  emit("update:modelValue", selection.value);
  emit("onchange", selection.value);
};

const nextSelection = () => {
  selectedIndex.value = Math.min(
    selectedIndex.value + 1,
    props.options.length - 1
  );

  scrollToSelected();
};

const prevSelection = () => {
  selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  scrollToSelected();
};

const scrollToSelected = () => {
  const selectedOption = optionRefs.value[selectedIndex.value];
  if (selectedOption) {
    selectedOption.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
};

const handleClose = () => {
  selection.value = props.options[selectedIndex.value].value as string;
  emit("update:modelValue", selection.value);
  emit("onchange", selection.value);
  emit("close");
};

onMounted(() => {
  if (props.modelValue) {
    const index = props.options.findIndex(
      (option) => option.value === props.modelValue
    );
    if (index !== -1) {
      selectedIndex.value = index;
    }
  }
});
</script>
