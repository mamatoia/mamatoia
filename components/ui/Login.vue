<template>
  <div class="flex flex-col space-y-4">
    <label class="fieldset-label text-base-content">{{ emailLabel }}</label>
    <label
      class="input validator rounded-sm bg-base-200 text-base-content border border-solid border-white p-0 w-full"
    >
      <input
        :type="emailInputType"
        class="input w-full rounded-sm bg-base-200 text-base-content"
        :placeholder="emailPlaceholder"
        required
        :autocomplete="emailInputType === 'email' ? 'email' : 'username'"
        :value="email"
        :class="inputClass"
        @input="$emit('update:email', $event.target.value)"
      />
    </label>

    <div class="validator-hint hidden">{{ validatorHint }}</div>

    <label class="fieldset-label text-base-content p-0">{{
      passwordLabel
    }}</label>
    <label
      class="input validator rounded-sm bg-base-200 text-base-content border border-solid border-white p-0 w-full"
    >
      <input
        type="password"
        class="input w-full rounded-sm bg-base-200 text-base-content border-white"
        :placeholder="passwordPlaceholder"
        :disabled="passwordDisabled"
        :value="password"
        :class="inputClass"
        @input="$emit('update:password', $event.target.value)"
      />
    </label>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  // ...otras props...
  inputClass: {
    type: String,
    default: "",
  },

  email: {
    type: String,
  },
  password: {
    type: String,
  },
  emailLabel: {
    type: String,
    default: "Correo electrónico o nombre de usuario",
  },
  emailPlaceholder: {
    type: String,
    default: "Correo electrónico o nombre de usuario",
  },
  passwordLabel: {
    type: String,
    default: "Contraseña",
  },
  passwordPlaceholder: {
    type: String,
    default: "Contraseña",
  },
  passwordDisabled: {
    type: Boolean,
    default: false, // Valor predeterminado
  },
  // Permite configurar el tipo del input para el campo "email".
  // Por defecto es 'email', pero puede establecerse a 'text' para aceptar números/usuario.
  emailInputType: {
    type: String,
    default: "email",
  },
  validatorHint: {
    type: String,
    default: "Enter valid email address",
  },
});
</script>

<style scoped></style>
