<template>
  <div class="overscroll-contain overflow-auto">
    <ul class="list bg-base-100 rounded-box shadow-md">
      <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Most played songs this week
      </li>

      <li
        v-for="artista in artistasOrdenado()"
        :key="artista.nombre"
        class="flex justify-between list-row hover:bg-base-200"
      >
        <nuxt-link
          :to="`/artista/${artista.codigo}`"
          class="flex items-center space-x-4 text-xs uppercase font-semibold"
        >
          <div>
            <img class="size-10 rounded-box flex-none" :src="artista.imagen" />
          </div>
          <div class="hidden md:block">
            <div>{{ artista.nombre }}</div>
          </div>
        </nuxt-link>
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

const artistasOrdenado = () => {
  if (props.orden === "asc") {
    return artistas.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else {
    return artistas.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }
};

const artistas = [
  {
    nombre: "Lara Campos",
    cancion: "René",
    imagen: "/images/imagen-laracampos.jpg",
    codigo: "laracampos",
  },
  {
    nombre: "Shakira",
    cancion: "Soltera",
    imagen: "/images/imagen-shakira.jpg",
    codigo: "shakira",
  },
  {
    nombre: "Radiohead",
    cancion: "Creep",
    imagen: "/images/imagen-radiohead.jpg",
    codigo: "radiohead",
  },
  {
    nombre: "The Beatles",
    cancion: "Hey Jude",
    imagen: "/images/imagen-thebeatles.jpg",
    codigo: "thebeatles",
  },
  {
    nombre: "U2",
    cancion: "With or Without You",
    imagen: "/images/imagen-u2.jpg",
    codigo: "u2",
  },
  {
    nombre: "The Rolling Stones",
    cancion: "Paint It Black",
    imagen: "/images/imagen-therollingstones.jpg",
    codigo: "therollingstones",
  },
  {
    nombre: "The Doors",
    cancion: "Light My Fire",
    imagen: "/images/imagen-thedoors.jpg",
    codigo: "thedoors",
  },
  {
    nombre: "The Police",
    cancion: "Every Breath You Take",
    imagen: "/images/imagen-thepolice.jpg",
    codigo: "thepolice",
  },
  {
    nombre: "The Clash",
    cancion: "Should I Stay or Should I Go",
    imagen: "/images/imagen-theclash.jpg",
    codigo: "theclash",
  },
];
</script>

<style></style>
