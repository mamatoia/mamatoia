<template>
  <div class="login-container">
    <h1 class="text-2xl font-bold mb-4">Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group mb-4">
        <label for="email" class="block mb-2">Correo Electrónico:</label>
        <input
          type="email"
          v-model="email"
          required
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-group mb-4">
        <label for="password" class="block mb-2">Contraseña:</label>
        <input
          type="password"
          v-model="password"
          required
          class="input input-bordered w-full"
        />
      </div>
      <button type="submit" class="btn btn-primary w-full">
        Iniciar Sesión
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

const handleLogin = () => {
  // Lógica de inicio de sesión aquí
  // Correo electrónico ingresado
  // Contraseña ingresada
};
</script>
