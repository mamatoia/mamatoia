<template>
  <div
    :class="['flex flex-col w-full', props.compact ? 'px-0 mb-0' : 'px-6 mb-4']"
  >
    <label
      v-if="props.showLabel"
      :class="['text-base-content font-semibold text-left mb-1', labelClass]"
    >
      {{ label }}
    </label>

    <!-- Trigger styled like a select (optional) -->
    <button
      v-if="props.showTrigger"
      type="button"
      :class="[
        'input',
        'w-full',
        'rounded-sm',
        'bg-base-200',
        'text-base-content',
        'border-white',
        'flex',
        'items-center',
        'justify-between',
        props.triggerClass,
      ]"
      @click="open()"
    >
      <span class="truncate">{{ props.triggerText || selectedLabel }}</span>
      <UiIcon name="outline:chevron-down" class="w-4 h-4 opacity-70" />
    </button>

    <!-- Small modal -->
    <teleport to="body">
      <dialog ref="dlg" class="modal">
        <div
          :class="[
            'modal-box',
            props.modalWidth || 'w-[28rem]',
            'max-w-full',
            'p-4',
            'rounded-sm',
          ]"
          :style="{ '--rounded-box': '0.125rem', borderRadius: '0.125rem' }"
        >
          <h3 class="font-bold text-base mb-4">
            {{ modalTitle || label }}
          </h3>

          <div class="max-h-60 overflow-y-auto">
            <ul class="space-y-1">
              <li
                v-for="(option, idx) in options"
                :key="idx"
                class="flex items-center gap-2 px-1 py-1 rounded cursor-pointer text-base hover:bg-base-300"
                :class="{ 'bg-base-300': option.value === value }"
                @click="select(option.value)"
              >
                <input
                  type="radio"
                  class="radio radio-primary radio-xs"
                  :checked="option.value === value"
                  @click.stop="select(option.value)"
                />
                <span class="truncate">{{ option.label }}</span>
              </li>
            </ul>
          </div>

          <div class="modal-action mt-4">
            <button class="btn btn-sm text-sm" @click="close">Cerrar</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </teleport>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref, watch } from "vue";
import UiIcon from "@/components/ui/Icon.vue";

const props = defineProps({
  label: { type: String, default: "Selecciona una opción" },
  options: { type: Array, required: true },
  modelValue: { type: [String, Number], default: "" },
  labelClass: { type: String, default: "text-sm" },
  modalTitle: { type: String, default: "" },
  // modalWidth accepts tailwind width classes like 'w-64','w-72','w-80','w-96' or arbitrary values like 'w-[28rem]'
  modalWidth: { type: String, default: "w-80" },
  // classes applied to the trigger so it matches other inputs
  triggerClass: { type: String, default: "text-[17px] font-normal" },
  // optional text to force in the trigger instead of the selected label
  triggerText: { type: String, default: "" },
  // whether to render the internal trigger button (useful when parent controls opening)
  showTrigger: { type: Boolean, default: true },
  // whether to render the top label (useful when embedding the modal into a list item)
  showLabel: { type: Boolean, default: true },
  // compact mode: remove outer padding/margin for inline embedding
  compact: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);
const dlg = ref(null);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const selectedLabel = computed(() => {
  const found = (props.options || []).find((o) => o.value === value.value);
  return found?.label ?? "";
});

const open = () => {
  try {
    dlg.value?.showModal?.();
  } catch {}
};
const close = () => {
  try {
    dlg.value?.close?.();
  } catch {}
};
const select = (val) => {
  value.value = val;
  close();
};

// expose programmatic control for parent components (open/close/select)
defineExpose({ open, close, select });

// Close dialog if v-model changes externally
watch(
  () => props.modelValue,
  () => {
    // no-op; could sync if needed
  }
);
</script>
