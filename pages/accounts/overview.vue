<template>
  <div>
    <HeaderAccounts />
    <div class="bg-base-200">
      <!-- Contenedor de las tarjetas -->
      <div
        class="flex justify-center items-center gap-4 pt-12 pb-3 p-1 w-3xl bg-base-200 mx-auto"
      >
        <!-- Primera tarjeta -->
        <div class="card w-2/3 h-40 bg-base-100 p-2 card-sm rounded-t-lg">
          <div class="card-body text-4xl font-bold">
            <h2 class="card-title">Tu plan</h2>
            <p>Spoti Free</p>
          </div>
        </div>

        <!-- Segunda tarjeta -->
        <div
          class="card w-1/3 bg-gradient-to-br from-info to-error h-40 bg-base-100 p-2 card-sm rounded-t-lg"
        >
          <div class="card-body flex justify-center items-center">
            <ui-icon name="outline:sparkles" class="w-7 h-7" />
            <h2 class="card-title">Unirte a Premium</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección Cuenta -->
    <SectionOverview
      title="Cuenta"
      :items="[
        {
          text: 'Editar Perfil',
          link: '/accounts/profile',
          icon: 'solid:pencil',
        },
        { text: 'Recuperar listas', link: '/', icon: 'solid:arrow-path' },
        { text: 'Dirección', link: '/', icon: 'outline:home' },
      ]"
    />

    <!-- Sección Pago -->
    <SectionOverview
      title="Pago"
      :items="[
        { text: 'Métodos de pago', icon: 'solid:credit-card', link: '/' },
        { text: 'Historial de pagos', icon: 'solid:clock', link: '/' },
        { text: 'Facturación', icon: 'solid:document', link: '/' },
      ]"
    />

    <!-- Sección Seguridad y Privacidad -->
    <SectionOverview
      title="Seguridad y Privacidad"
      :items="[
        { text: 'Cambiar Contraseña', icon: 'solid:lock-closed', link: '/' },
        { text: 'Notificaciones', icon: 'solid:bell', link: '/' },
        {
          text: 'Privacidad de la cuenta',
          icon: 'solid:eye',
          link: '/',
        },
        {
          text: 'Cerrar sesión en todas partes',
          icon: 'solid:arrow-right',
          link: '/',
          class: 'p-20',
        },
      ]"
    />

    <div>
      <PieEnlaces class="hidden sm:block" />
    </div>
  </div>
</template>
