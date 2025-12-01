<template>
  <div class="md:flex items-center justify-start pt-15 md:pt-4 p-4">
    <div class="navbar">
      <ui-buttons-buttonplay
        class="mx-2 mr-4 transition duration-300 ease-in-out transform hover:scale-105"
      />

      <ui-buttons-button-link
        variant="btn-outline rounded-full mr-2"
        @click="siguiendo = !siguiendo"
      >
        {{ siguiendo ? "Siguiendo" : "Seguir" }}
      </ui-buttons-button-link>

      <div class="navbar-start">
        <div class="dropdown">
          <div class="tooltip" :data-tip="`Más opciones para ${artista}`">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
              <ui-icon name="outline:ellipsis-horizontal" class="w-7 h-7" />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-base dropdown-content bg-base-200 rounded-md z-1 mt-3 w-72 p-2"
          >
            <li>
              <a>
                <ui-icon
                  name="outline:x-mark"
                  class="w-4 h-4 mr-2 text-accent"
                />
                Dejar de seguir
              </a>
            </li>
            <li>
              <a>
                <ui-icon name="outline:no-symbol" class="w-4 h-4 mr-2" />
                No poner a este artista
              </a>
            </li>
            <li>
              <a>
                <ui-icon name="outline:signal" class="w-4 h-4 mr-2" />
                Ir a la radio del artista
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { ref } from "vue";

const props = defineProps({
  artista: {
    type: String,
    default: "Artista Desconocido", // Valor predeterminado
  },
});

const siguiendo = ref(false);
</script>
