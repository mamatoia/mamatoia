<template>
  <div class="hero min-h-screen bg-[url('/images/background-home.webp')]">
    <div class="hero-overlay"></div>
    <div class="hero-content text-neutral-content text-center">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">Bienvenidos</h1>
        <p class="mb-5">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </p>
        <div class="flex justify-center space-x-4">
          <UiButtonsButtonLink to="/about" variant="btn-primary"
            >Empecemos!</UiButtonsButtonLink
          >
          <UiButtonsButtonLink to="/accounts/contact" variant="btn-secondary"
            >Reserva Ahora</UiButtonsButtonLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
