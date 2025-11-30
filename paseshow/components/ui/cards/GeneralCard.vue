<template>
  <div class="min-h-screen flex flex-col">
    <div class="sticky top-0 z-[100] bg-base-300 text-base-100">
      <div class="relative px-4 pt-7 pb-7">
        <div class="absolute right-4 top-1/2 -translate-y-1/2">
          <CloseButton />
        </div>
      </div>
    </div>

    <div class="flex justify-center flex-1">
      <fieldset class="fieldset w-3xl bg-base-300 pt-0 p-4 rounded-box text-lg">
        <div class="flex flex-col items-start">
          <Input
            label="Terminal"
            v-model="Terminal"
            placeholder=""
            label-class="text-base text-base-100"
            input-class="text-base font-normal bg-base-300 text-base-100 border-base-300 placeholder-base-300"
          />
          <Input
            label="Contador"
            v-model="Contador"
            placeholder=""
            label-class="text-base text-base-100"
            input-class="text-base font-normal bg-base-300 text-base-100 border-base-300 placeholder-base-300"
          />
          <Input
            label="Vencimiento (minutos)"
            v-model="Vencimiento"
            placeholder=""
            label-class="text-base text-base-100"
            input-class="text-base font-normal bg-base-300 text-base-100 border-base-300 placeholder-base-300"
          />
          <div class="w-full">
            <Input
              label="Servidor Primario"
              v-model="servidorPrimario"
              placeholder="https://api.paseshow.com.ar/"
              label-class="text-base text-base-100"
              input-class="text-base font-normal bg-base-300 text-base-100 border-base-300 placeholder-base-300"
            />
          </div>
          <div class="w-full">
            <Input
              label="Servidor Secundario"
              v-model="servidorSecundario"
              placeholder="https://api.paseshow.com.ar/"
              label-class="text-base text-base-100"
              input-class="text-base font-normal bg-base-300 text-base-100 border-base-300 placeholder-base-300"
            />
          </div>
          <FieldSelectModal
            v-model="tipoDeEscaneo"
            label="Tipo de Escaneo"
            :options="[
              { value: 'continuo ingreso', label: 'Continuo Ingreso' },
              { value: 'continuo salida', label: 'Continuo Salida' },
              {
                value: 'continuo ingreso y salida',
                label: 'Continuo Ingreso Y Salida',
              },
            ]"
            label-class="text-base text-base-100"
            modal-title="Seleccionar tipo de escaneo"
            trigger-class="text-base font-normal bg-base-300 text-base-100 border-base-300"
          />
          <Input
            label="Usuario por defecto"
            v-model="usuarioPorDefecto"
            placeholder=""
            label-class="text-base text-base-100"
            input-class="text-base font-normal bg-base-300 text-base-100 border-base-300 placeholder-base-300"
          />
          <Input
            label="Clave por defecto"
            v-model="clavePorDefecto"
            placeholder=""
            label-class="text-base text-base-100"
            input-class="text-base font-normal bg-base-300 text-base-100 border-base-300 placeholder-base-300"
          />
          <FieldSelectModal
            v-model="filtroDeDescuentos"
            label="Filtro de Descuentos"
            :options="[
              { value: 'sin filtrar', label: 'Sin Filtrar' },
              { value: 'filtrar descuentos', label: 'Filtrar Descuentos' },
            ]"
            label-class="text-base text-base-100"
            modal-title="Seleccionar filtro"
            trigger-class="text-base font-normal bg-base-300 text-base-100 border-base-300"
          />
          <ToggleItem
            class="mt-2"
            label="Habilitar NFC"
            v-model="habilitarNFC"
            label-class="text-base text-base-100"
            toggle-class="bg-base-300"
          />
          <ToggleItem
            label="Modo Online"
            v-model="modoOnline"
            label-class="text-base text-base-100"
            toggle-class="bg-base-300"
          />
          <ToggleItem
            label="Sincronizar"
            v-model="sincronizar"
            label-class="text-base text-base-100"
            toggle-class="bg-base-300"
          />
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { Input, ServerFields, ToggleField as ToggleItem } from "../fieldset";
import FieldSelectModal from "@/components/fields/FieldSelectModal.vue";
import CloseButton from "../buttons/CloseButton.vue";
import { useGeneralSettingsStore } from "~/src/stores/paseshow/generalSettings";

const settingsStore = useGeneralSettingsStore();

// Computeds que conectan con el store
const Terminal = computed({
  get: () => settingsStore.terminal,
  set: (value: string) => (settingsStore.terminal = value),
});

const Contador = computed({
  get: () => settingsStore.contador,
  set: (value: string) => (settingsStore.contador = value),
});

const Vencimiento = computed({
  get: () => settingsStore.vencimiento,
  set: (value: string) => (settingsStore.vencimiento = value),
});

const tipoDeEscaneo = computed({
  get: () => settingsStore.tipoDeEscaneo,
  set: (value: string) => (settingsStore.tipoDeEscaneo = value),
});

const usuarioPorDefecto = computed({
  get: () => settingsStore.usuarioPorDefecto,
  set: (value: string) => (settingsStore.usuarioPorDefecto = value),
});

const clavePorDefecto = computed({
  get: () => settingsStore.clavePorDefecto,
  set: (value: string) => (settingsStore.clavePorDefecto = value),
});

const filtroDeDescuentos = computed({
  get: () => settingsStore.filtroDeDescuentos,
  set: (value: string) => (settingsStore.filtroDeDescuentos = value),
});

const habilitarNFC = computed({
  get: () => settingsStore.habilitarNFC,
  set: (value: boolean) => (settingsStore.habilitarNFC = value),
});

const modoOnline = computed({
  get: () => settingsStore.modoOnline,
  set: (value: boolean) => (settingsStore.modoOnline = value),
});

const sincronizar = computed({
  get: () => settingsStore.sincronizar,
  set: (value: boolean) => (settingsStore.sincronizar = value),
});

const servidorPrimario = computed({
  get: () => settingsStore.servidorPrimario,
  set: (value: string) => (settingsStore.servidorPrimario = value),
});

const servidorSecundario = computed({
  get: () => settingsStore.servidorSecundario,
  set: (value: string) => (settingsStore.servidorSecundario = value),
});

// Cargar configuración al montar el componente
onMounted(async () => {
  try {
    settingsStore.loadFromStorage();
  } catch (error) {
    console.error("Error loading settings:", error);
  }
});

// Guardar configuración cuando se modifican los valores
const saveSettings = () => {
  try {
    settingsStore.saveToStorage();
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// Guardar cuando el usuario navega fuera de la página
onBeforeUnmount(() => {
  try {
    settingsStore.saveToStorage();
  } catch (error) {
    console.error("Error saving settings on unmount:", error);
  }
});
</script>
