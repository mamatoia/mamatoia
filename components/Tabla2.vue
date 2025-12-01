<template>
  <div class="overscroll-contain max-h-96 overflow-auto">
    <ul class="list bg-base-100 rounded-box shadow-md">
      <li class="p-4 pb-2 text-3xl opacity-60 tracking-wide">Populares</li>

      <li
        v-for="artista in artistasOrdenado()"
        :key="artista.nombre"
        class="flex justify-between list-row hover:bg-base-200"
      >
        <nuxt-link
          :to="`/artista/${artista.codigo}`"
          class="flex items-center space-x-4"
        >
          <div>
            <img class="size-10 rounded-box flex-none" :src="artista.imagen" />
          </div>
          <div class="hidden md:block">
            <div>{{ artista.nombre }}</div>
            <div class="text-xs uppercase font-semibold opacity-60">
              {{ artista.cancion }}
            </div>
          </div>
        </nuxt-link>
        <button class="btn btn-square btn-ghost">
          <svg
            class="size-[1.2em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M6 3L20 12 6 21 6 3z"></path>
            </g>
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    orden?: string;
  }>(),
  {
    orden: "asc",
  }
);

const artistas = [
  {
    nombre: "Lara Campos",
    imagen: "/images/imagen-laracampos.jpg",
    cancion1: "René",

    codigo: "laracampos",
  },
  {
    nombre: "Shakira",
    imagen: "/images/imagen-shakira.jpg",
    cancion: "Soltera",

    codigo: "shakira",
  },
  {
    nombre: "Radiohead",
    imagen: "/images/imagen-radiohead.jpg",
    cancion: "Creep",

    codigo: "radiohead",
  },
  {
    nombre: "The Beatles",
    imagen: "/images/imagen-thebeatles.jpg",
    cancion: "Hey Jude",

    codigo: "thebeatles",
  },
  {
    nombre: "U2",
    imagen: "/images/imagen-u2.jpg",
    cancion1: "With or Without You",

    codigo: "u2",
  },
  {
    nombre: "The Rolling Stones",
    imagen: "/images/imagen-therollingstones.jpg",
    cancion: "Paint It Black",

    codigo: "therollingstones",
  },
  {
    nombre: "The Doors",
    imagen: "/images/imagen-thedoors.jpg",
    cancion: "Light My Fire",

    codigo: "thedoors",
  },
  {
    nombre: "The Police",
    imagen: "/images/imagen-thepolice.jpg",
    cancion: "Every Breath You Take",
    codigo: "thepolice",
  },
  {
    nombre: "The Clash",
    imagen: "/images/imagen-theclash.jpg",
    cancion: "Should I Stay or Should I Go",

    codigo: "theclash",
  },
];
</script>

<style>
/* Agrega estilos personalizados aquí si es necesario */
</style>
