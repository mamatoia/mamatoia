<template>
  <div class="p-2 flex flex-1 flex-col">
    <div class="rounded-t bg-base-200">
      <Barra
        v-model="orden"
        @filtrar="toggleFiltrar"
        @crearLista="crearLista"
      />
    </div>

    <div v-for="(lista, index) in listas" :key="index" class="mt-4">
      <input
        class="input input-bordered w-full mb-2"
        v-model="lista.nombre"
        placeholder="Nombre de la lista"
      />
      <ul>
        <li v-for="(cancion, i) in lista.canciones" :key="i">
          {{ cancion.artista }} - {{ cancion.cancion }}
        </li>
      </ul>
    </div>

    <Listado
      :orden="orden"
      :filtro="filtrar"
      @agregarCancion="agregarCancion"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Barra from "@/components/Barra.vue";
import Listado from "@/components/Listado.vue";

const orden = ref("asc");
const filtrar = ref(false);
const listas = ref([]);

const toggleFiltrar = () => {
  filtrar.value = !filtrar.value;
};

const crearLista = () => {
  listas.value.push({
    nombre: "Nueva Lista",
    canciones: [],
  });
};

const agregarCancion = (cancion) => {
  if (listas.value.length === 0) {
    alert("Primero crea una lista para agregar canciones.");
    return;
  }
  listas.value[0].canciones.push(cancion); // Agrega a la primera lista por defecto
};
</script>
