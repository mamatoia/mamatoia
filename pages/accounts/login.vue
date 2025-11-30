<template>
  <div class="flex justify-center">
    <fieldset class="fieldset w-xl bg-base-200 pt-10 pb-12 rounded-box">
      <div class="flex justify-center pt-10">
        <ui-icon name="sn:spotify" class="w-10 h-10" />
      </div>
      <label
        class="fieldset-legend text-base-content text-center justify-center text-3xl md:text-4xl font-bold mb-8"
      >
        Inicia sesión en Spoti
      </label>
      <div class="flex flex-col items-center space-y-4">
        <!-- Google -->

        <UiButtonsSocialbutton logo="sn:google" text="Continuar con Google" />

        <!-- Facebook -->
        <UiButtonsSocialbutton
          logo="sn:facebook"
          text="Continuar con Facebook"
        />
        <!-- Apple -->
        <UiButtonsSocialbutton
          logo="sn:spotify"
          text="Continuar con Spotify"
          @click="loginWithSpotify"
        />
      </div>
      <hr class="divider mt-10 text-base-200" />

      <div class="flex flex-col items-center space-y-4">
        <UiLogin
          class="w-xs"
          emailLabel="Correo electrónico o nombre de usuario"
          emailPlaceholder="Correo electrónico o nombre de usuario"
          passwordLabel="Contraseña"
          passwordPlaceholder="Contraseña"
        />
        <UiButtonsButtonLink
          to="/accounts/password-reset"
          variant="link"
          class="link"
        >
          ¿Se te ha olvidado la contraseña?
        </UiButtonsButtonLink>
        <div class="text-center">
          <span class="text-sm text-base-content">¿No tienes cuenta?</span
          ><UiButtonsButtonLink
            to=""
            variant="link"
            class="link p-0 m-0 inline"
          >
            Suscribete a Spoty
          </UiButtonsButtonLink>
        </div>

        <button
          class="transition duration-150 ease-in-out transform hover:scale-105 btn btn-success btn-circle mt-4 w-xs text-white"
        >
          Iniciar sesión
        </button>
      </div>
    </fieldset>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/src/stores/auth";

const authStore = useAuthStore();
const loginWithSpotify = () => {
  authStore.redirectToSpotify();
};
</script>
