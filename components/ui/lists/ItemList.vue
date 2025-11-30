<template>
  <div
    class="flex items-center hover:bg-base-200 rounded-box"
    :class="{ 'bg-primary-content': selected }"
    @click="selectArtist"
  >
    <nuxt-link
      :to="`/artista/${artista.codigo}`"
      class="flex flex-1 justify-between list-row"
    >
      <div>
        <img class="size-10 rounded-box flex-none" :src="artista.imagen" />
      </div>
      <div class="hidden md:block flex-1">
        <div>{{ artista.nombre }}</div>
        <div class="text-xs uppercase font-semibold opacity-60">
          {{ cancion }}
        </div>
      </div>
    </nuxt-link>
    <div v-if="!filtro" class="flex justify-end">
      <button class="btn btn-square btn-ghost">
        <SwapIcon iconOn="solid:play" iconOff="outline:play" />
      </button>
      <button class="btn btn-square btn-ghost">
        <SwapIcon iconOn="solid:heart" iconOff="outline:heart" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import SwapIcon from "@/components/ui/icons/SwapIcon.vue";

const props = defineProps({
  artista: {
    type: Object,
    required: true,
  },
  cancion: {
    type: String,
    required: true,
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

const emit = defineEmits(["select", "agregarCancion"]);

const selectArtist = () => {
  emit("select");
};
</script>

<style scoped>
.bg-yellow-200 {
  background-color: #fefcbf;
}
</style>
