<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Simulación de Gravedad en Cono Escalonado</h1>
    <div class="form-control mb-4">
      <label for="initialRadius" class="label">
        <span class="label-text">Radio Inicial (km):</span>
      </label>
      <input v-model="initialRadius" type="number" id="initialRadius" class="input input-bordered" />
    </div>
    <div class="form-control mb-4">
      <label for="radiusIncrement" class="label">
        <span class="label-text">Incremento del Radio por Escalón (km):</span>
      </label>
      <input v-model="radiusIncrement" type="number" id="radiusIncrement" class="input input-bordered" />
    </div>
    <div class="form-control mb-4">
      <label for="stepHeight" class="label">
        <span class="label-text">Altura de cada Escalón (km):</span>
      </label>
      <input v-model="stepHeight" type="number" id="stepHeight" class="input input-bordered" />
    </div>
    <div class="form-control mb-4">
      <label for="numSteps" class="label">
        <span class="label-text">Cantidad de Escalones:</span>
      </label>
      <input v-model="numSteps" type="number" id="numSteps" class="input input-bordered" />
    </div>
    <div class="form-control mb-4">
      <button @click="calculateGravity" class="btn btn-primary">Calcular Gravedad</button>
    </div>
    <div v-if="gravityResult !== null" class="mt-4">
      <h2 class="text-xl font-semibold">Resultado de Gravedad: {{ gravityResult }} m/s²</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const initialRadius = ref(0);
const radiusIncrement = ref(0);
const stepHeight = ref(0);
const numSteps = ref(0);
const gravityResult = ref<number | null>(null);

initialRadius.value = 0;
radiusIncrement.value = 100;
stepHeight.value = 100;
numSteps.value = 5;

const density = 5; // g/cm^3
const G = 6.67430e-11; // m^3 kg^-1 s^-2 (constante de gravitación universal)

function calculateGravity() {
  let totalGravity = 0;
  let currentRadius = initialRadius.value * 100000; // Convert km to cm
  const height = stepHeight.value * 100000; // Convert km to cm
  const steps = numSteps.value;

  const radiusKm = radiusIncrement.value;
  const heightKm = stepHeight.value;

  const heightCm = heightKm * 100000; // cm

  for (let i = 1; i <= steps; i++) {


    const radiusCm = i*radiusKm * 100000; // cm

    const volumeCm3 = Math.PI * Math.pow(radiusCm, 2)

    const mass = volumeCm3 * density; // g
    const massKg = mass / 1000; // kg
    const distanceM = i * heightCm/100; // Convert cm to m

    const gravity = (G * massKg) / Math.pow(distanceM, 2); // m/s²

    totalGravity += gravity;

    currentRadius += radiusIncrement.value * 100000; // Convert km to cm
  }

  gravityResult.value = totalGravity;
}
</script>
