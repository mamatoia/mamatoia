<template>
  <FieldInput
    v-model="dia"
    label="Fecha de nacimiento"
    type="tel"
    placeholder="Día"
    pattern="[1-31]*"
    minlength="1"
    maxlength="2"
    required
  />
  <FieldSelect
    class="fieldset w-full pt-5.5"
    v-model="mes"
    label=""
    :options="[
      { value: '01', label: 'Enero' },
      { value: '02', label: 'Febrero' },
      { value: '03', label: 'Marzo' },
      { value: '04', label: 'Abril' },
      { value: '05', label: 'Mayo' },
      { value: '06', label: 'Junio' },
      { value: '07', label: 'Julio' },
      { value: '08', label: 'Agosto' },
      { value: '09', label: 'Septiembre' },
      { value: '10', label: 'Octubre' },
      { value: '11', label: 'Noviembre' },
      { value: '12', label: 'Diciembre' },
    ]"
  />
  <FieldInput
    class="fieldset pt-5.5"
    v-model="anio"
    label=""
    type="tel"
    placeholder="Año"
    pattern="[1900-2025]*"
    minlength="4"
    maxlength="4"
    required
  />
</template>
<script lang="ts" setup>
import FieldInput from "@/components/fields/FieldInput.vue";
import FieldSelect from "@/components/fields/FieldSelect.vue";
import { ref, computed, watch } from "vue";

const props = defineProps({
  diaNacimiento: String,
  mesNacimiento: String,
  anioNacimiento: String,
  fechaNacimiento: String,
});

const emit = defineEmits([
  "update:diaNacimiento",
  "update:mesNacimiento",
  "update:anioNacimiento",
  "update:fechaNacimiento",
]);

const dia = ref(props.diaNacimiento);
const mes = ref(props.mesNacimiento);
const anio = ref(props.anioNacimiento);

const fechaCompleta = computed(() => `${anio.value}-${mes.value}-${dia.value}`);
watch(fechaCompleta, (newFecha) => emit("update:fechaNacimiento", newFecha));

// Emitir cambios al componente padre
watch(fechaCompleta, (newFecha) => emit("update:fechaNacimiento", newFecha));
</script>
