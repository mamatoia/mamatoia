<template>
  <div class="flex flex-col items-center p-10 min-h-screen bg-base-200">
    <div class="card w-full max-w-sm bg-base-200">
      <div class="card-body">
        <div class="flex justify-center mb-4">
          <ui-icon name="sn:spotify" class="w-10 h-10" />
        </div>
        <h2 class="card-title text-centertext-base-content text-3xl text-left">
          Restablece la Contraseña
        </h2>
        <p class="text-left text-base-content text-balance pt-2 pb-2">
          Escribe la dirección de correo electrónico o el nombre de usuario
          vinculados a tu cuenta de Spoti y te enviaremos un mensaje.
        </p>

        <FormUser
          labelText="Dirección de correo electrónico o nombre de usuario"
          buttonLabel="Enviar enlace"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");

const handlePasswordReset = () => {
  if (email.value) {
    // Enlace de restablecimiento enviado
    alert("Se ha enviado un enlace de restablecimiento a tu correo.");
    email.value = "";
  }
};
</script>

<style scoped>
.card {
  margin-top: 2rem;
}
</style>
