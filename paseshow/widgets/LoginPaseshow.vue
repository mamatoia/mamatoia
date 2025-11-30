<template>
  <UiLogin
    class="w-60"
    emailLabel="Correo electrónico o nombre de usuario"
    emailPlaceholder="Usuario"
    passwordLabel="Contraseña"
    passwordPlaceholder="Contraseña"
    emailLabelClass="opacity-0"
    passwordLabelClass="opacity-0"
    inputClass="bg-neutral border-neutral"
    v-model:email="email"
    v-model:password="password"
    :emailInputType="'text'"
    validatorHint="Campo requerido"
  />
  <div class="flex justify-center items-center mt-4">
    <span class="text-xs text-neutral-content">{{ message }}</span>
  </div>
  <button
    @click="loginPaseshow"
    class="btn w-60 btn-primary text-white font-semibold !text-sm mt-8 flex justify-between items-center"
  >
    <span class="mx-auto">Ingresar</span>
    <ui-icon name="solid:arrow-right" class="w-5 h-5" />
  </button>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/src/stores/auth";

const email = ref("");
const password = ref("");
const message = ref("Ingrese su usuario y contraseña para continuar");

const authStore = useAuthStore();
const router = useRouter();
const loginPaseshow = async () => {
  const result = await authStore.loginPaseshow(email.value, password.value);

  // Resultado obtenido
  if (result.error) {
    console.error("Login failed:", result.message);
    message.value = result.message;
    return;
  } else {
    // Login exitoso
    router.push("/eventos");
  }
};
</script>
