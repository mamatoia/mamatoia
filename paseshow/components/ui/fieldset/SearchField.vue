<template>
  <div class="px-4 pb-4">
    <label
      class="input input-bordered flex items-center gap-2 w-full bg-base-100"
    >
      <UiIcon name="outline:magnifying-glass" class="w-5 h-5 opacity-70" />
      <input
        ref="searchInput"
        type="text"
        class="grow"
        :placeholder="placeholder"
        :value="modelValue"
        @input="search"
      />
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import UiIcon from "@/components/ui/Icon.vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Buscar...",
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["change"]);

const searchInput = ref(null);

const search = (event) => {
  emit("change", event.target.value);
};

onMounted(() => {
  if (props.autoFocus && searchInput.value) {
    searchInput.value.focus();
  }
});
</script>
