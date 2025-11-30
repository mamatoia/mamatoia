<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-base-200"
  >
    <div class="card items-center w-full max-w-sm bg-base-200 pt-10 md:p-0">
      <div class="card-body">
        <h1
          class="text-4xl md:text-5xl text-base-content font-bold text-center mb-10 md:mb-4"
        >
          Regístrate para empezar a escuchar contenido
        </h1>
        <div class="flex justify-center mb-0 md:mb-4">
          <FormUser
            labelText="Dirección de correo electrónico"
            buttonLabel="Siguiente"
            pleaceholderText="nombre@dominio.com"
          />
        </div>
        <div class="divider">o</div>
      </div>
      <div class="flex flex-col items-center space-y-4">
        <!-- Google -->

        <UiButtonsSocialbutton logo="sn:google" text="Registrarte con Google" />

        <!-- Facebook -->
        <UiButtonsSocialbutton
          logo="sn:facebook"
          text="Registrarte con Facebook"
        />
        <!-- Apple -->
        <UiButtonsSocialbutton logo="sn:apple" text="Registrarte con Apple" />
      </div>
      <div class="divider"></div>
      <div>
        ¿Ya tienes una cuenta?
        <nuxt-link
          to="/accounts/contact"
          exact-active-class="link-active"
          class="link"
          :class="{ 'bg-base-300': $route.path === '/accounts/contact' }"
        >
          <span class="dock-label pb-8">Ingresa sesión aquí</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
