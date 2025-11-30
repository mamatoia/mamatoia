<template>
  <div class="bg-base-200">
    <div class="navbar bg-base-200 w-5xl mx-auto">
      <div class="flex-1">
        <NuxtLink to="/about" class="btn btn-ghost text-xl font-bold"
          ><ui-icon
            name="sn:spotify"
            class="w-10 h-10 text-primary"
          />Spoty</NuxtLink
        >
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="flex flex-row items-start">
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-6">
            <li>
              <details>
                <summary class="font-bold text-base-content text-base">
                  <ui-icon
                    name="outline:user-circle"
                    class="w-10 h-10 mx-4"
                  />Perfil
                </summary>
                <ul class="p-1 text-left z-1 min-w-40">
                  <li>
                    <NuxtLink to="/accounts/overview" class="link link-hover"
                      >Cuenta
                    </NuxtLink>
                  </li>
                  <li><a>Cerrar sesión</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
