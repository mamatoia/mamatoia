<template>
  <form
    @submit.prevent="handlePasswordReset"
    class="flex flex-col items-center"
  >
    <div class="w-full">
      <label class="label text-base-content text-wrap font-bold pb-2">
        <span class="label-text">{{ labelText }}</span>
      </label>
      <input
        type="email"
        v-model="email"
        :placeholder="pleaceholderText"
        class="input w-full bg-base-200"
        required
      />
    </div>
    <div class="w-full mt-4">
      <button class="btn btn-primary btn-circle w-full" type="submit">
        {{ buttonLabel }}
      </button>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
  labelText: {
    type: String,
    default: "Dirección de correo electrónico o nombre de usuario",
  },
  buttonLabel: {
    type: String,
    default: "Enviar enlace",
  },
  pleaceholderText: {
    type: String,
    default: "",
  },
});

const email = ref("");

const handlePasswordReset = () => {
  // Email ingresado
};
</script>
