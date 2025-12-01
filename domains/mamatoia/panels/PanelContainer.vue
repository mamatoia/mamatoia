<template>
  <div class="flex flex-1 flex-col">
    <div :class="['rounded-t sticky top-0 z-20', bgClass]">
      <slot name="header" />
    </div>
    <div ref="scrollContainer" class="h-[calc(100vh-120px)] overflow-auto">
      <PullToRefresh
        v-if="refreshIsVisible && allowRefresh"
        :white-icons="true"
        @refresh="$emit('refresh')"
      />
      <slot />
    </div>
  </div>
</template>

<script setup>
import { on } from "events";
import { defineProps } from "vue";
import PullToRefresh from "../components/ui/PullToRefresh.vue";

const scrollContainer = ref(null);
const refreshIsVisible = ref(true);

defineEmits(["refresh"]);
const props = defineProps({
  bgClass: {
    type: String,
    default: "panel-bg",
  },
  allowRefresh: {
    type: Boolean,
    default: false,
  },
});

const canScroll = ref(false);
onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", (e) => {
      refreshIsVisible.value = e.target.scrollTop === 0;
    });
  }
});
</script>
