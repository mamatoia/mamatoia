<template>
  <PFilterSection
    :label="primaryTab.label"
    :bg-class="bgClass"
    :underline-class="
      activeTab === primaryTab.key ? 'bg-primary' : 'bg-primary/0'
    "
    :text-class="
      activeTab === primaryTab.key
        ? '!text-base-content'
        : '!text-base-content/70'
    "
    @label-click="$emit('update:activeTab', primaryTab.key)"
  >
    <template #tabs>
      <span
        v-for="tab in secondaryTabs"
        :key="tab.key"
        :class="[
          'relative inline-block leading-none pb-4 cursor-pointer transition-colors',
          activeTab === tab.key ? 'text-base-content' : 'text-base-content/70',
        ]"
        @click="$emit('update:activeTab', tab.key)"
      >
        <span
          :class="[
            'absolute left-0 bottom-0 h-1 w-full',
            activeTab === tab.key ? 'bg-primary' : 'bg-primary/0',
          ]"
          aria-hidden="true"
        />
        {{ tab.label }}
      </span>
    </template>
  </PFilterSection>
</template>

<script setup>
import PFilterSection from "./FilterSection.vue";

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  primaryTab: {
    type: Object,
    required: true,
    // { key: 'todos', label: 'Todos' }
  },
  secondaryTabs: {
    type: Array,
    default: () => [],
    // [{ key: 'favoritos', label: 'Favoritos' }]
  },
  bgClass: {
    type: String,
    default: "bg-base-100",
  },
});

defineEmits(["update:activeTab"]);
</script>
