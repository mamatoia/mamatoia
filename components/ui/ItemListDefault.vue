<template>
  <div
    class="flex items-center hover:bg-base-200 static"
    :class="{ 'bg-primary-content': selected }"
    @mouseover="hoverItem = true"
    @mouseleave="hoverItem = false"
    @click="selectArtist"
  >
    <div
      class="flex justify-start items-center invisible hover:visible"
      :class="{ visible: selected || hoverItem }"
    >
      <div class="btn btn-square absolute left-4 z-10 opacity-60">
        <UiButtonsButtonplay class="w-8 h-8" />
      </div>
    </div>
    <div @click="$emit('close')" class="flex flex-1 justify-between list-row">
      <div>
        <img class="size-10 rounded-box flex-none" :src="artista.imagen" />
      </div>
      <div class="hidden md:block flex-1">
        <div>{{ artista.nombre }}</div>

        <div v-if="!filtro" class="text-xs uppercase font-semibold opacity-60">
          {{ artista.cancion }}
        </div>
      </div>
    </div>
    <div
      class="flex justify-end items-center invisible hover:visible"
      :class="{ visible: selected || hoverItem }"
    >
      <button class="btn btn-square absolute right-0 z-10">
        <ui-icon name="outline:x-mark" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  artista: {
    type: Object,
    required: true,
  },
  orden: {
    type: String,
    default: "asc",
  },
  filtro: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["select", "close"]);

const selectArtist = () => {
  emit("select");
};

const hoverItem = ref(false);
</script>

<style scoped>
.bg-yellow-200 {
  background-color: #fefcbf;
}
</style>
