<template>
  <div class="bg-base-200 min-h-screen flex flex-col">
    <header-accounts />
    <div class="flex justify-center flex-1">
      <fieldset class="fieldset w-3xl bg-base-200 pt-12 p-4 rounded-box">
        <UiButtonsButtonLink
          to="/accounts/overview"
          variant="btn-neutral"
          class="btn btn-circle w-10 h-10 text-neutral-content flex items-center justify-center"
        >
          <ui-icon name="outline:chevron-left" class="w-5 h-5" />
        </UiButtonsButtonLink>
        <label
          class="fieldset-legend text-base-content justify-start text-4xl font-bold mb-8"
        >
          Editar perfil
        </label>
        <div class="flex flex-col items-start">
          <!-- Componente UiLogin -->
          <UiLogin
            class="w-full"
            emailLabel="Correo electrónico o nombre de usuario"
            emailPlaceholder="Correo electrónico o nombre de usuario"
            passwordLabel="Contraseña"
            passwordPlaceholder="Contraseña"
            :passwordDisabled="true"
            v-model:email="email"
          />

          <!-- Nuevos Fieldset -->
          <FieldSelect
            v-model="sexo"
            label="Sexo"
            :options="[
              { value: 'femenino', label: 'Femenino' },
              { value: 'masculino', label: 'Masculino' },
              { value: 'no-binario', label: 'No Binario' },
            ]"
          />
          <div class="flex flex-row items-center w-full space-x-4">
            <DateSelect v-model:fechaNacimiento="fechaNacimiento" />
          </div>
        </div>
        <FieldSelect
          v-model="pais"
          label="País o región"
          :options="[
            { value: 'ES', label: 'España' },
            { value: 'US', label: 'Estados Unidos' },
            { value: 'MX', label: 'México' },

            { value: 'BR', label: 'Brasil' },
            { value: 'CL', label: 'Chile' },
            { value: 'CO', label: 'Colombia' },
            { value: 'PE', label: 'Perú' },
            { value: 'VE', label: 'Venezuela' },
            { value: 'CL', label: 'Chile' },
            { value: 'AR', label: 'Argentina' },
            { value: 'BR', label: 'Brasil' },
            { value: 'CO', label: 'Colombia' },
            { value: 'PE', label: 'Perú' },
          ]"
        />
        <FieldCheckbox v-model="compartirDatos">
          Compartir mis datos de registro con los proveedores de contenidos de
          Spotify para fines de marketing. Ten en cuenta que tus datos pueden
          ser transferidos a un país fuera del EEE, tal y como se describe en
          nuestra política de privacidad.
        </FieldCheckbox>

        <div class="flex justify-end mt-4">
          <UiButtonsButtonLink
            to="/accounts/overview"
            variant="btn-base-200"
            class="btn-circle mt-4 w-30 text-base-content"
          >
            Cancelar
          </UiButtonsButtonLink>

          <button
            class="transition duration-50 ease-in-out transform hover:scale-105 btn btn-success btn-circle mt-4 w-48 text-base-200"
            @click="saveProfile"
            :disabled="loading"
          >
            <template v-if="loading">
              <span class="loading loading-spinner loading-sm mr-2"></span>
              Guardando...
            </template>
            <template v-else> Guardar perfil </template>
          </button>
        </div>
      </fieldset>
    </div>

    <div>
      <PieEnlaces class="hidden sm:block" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import FieldInput from "@/components/fields/FieldInput.vue";
import FieldSelect from "@/components/fields/FieldSelect.vue";
import FieldCheckbox from "@/components/fields/FieldCheckbox.vue";
import DateSelect from "@/components/fields/DateSelect.vue";
import { ref } from "vue";

import { useProfileStore } from "~/src/stores/profile";

// CODIGO DESDE AQUI.... NO SE QUE HACE LO DE ARRIBA....

const profileStore = useProfileStore();
const profile = profileStore.getProfile();

const email = ref(profile.email);
const sexo = ref(profile.sexo);

const fechaNacimiento = ref(profile.fechaNacimiento);

const pais = ref(profile.pais);
const compartirDatos = ref(profile.compartirDatos);
const loading = ref(false);

const saveProfile = async () => {
  loading.value = true; // Activa el estado de carga
  try {
    profileStore.save({
      email: email.value,
      sexo: sexo.value,

      fechaNacimiento: fechaNacimiento.value,
      pais: pais.value,
      compartirDatos: compartirDatos.value,
    });
    // Aquí puedes agregar una notificación de éxito si es necesario
  } catch (error) {
    console.error("Error al guardar el perfil:", error);
    // Aquí puedes manejar errores si es necesario
  } finally {
    loading.value = false; // Desactiva el estado de carga
  }
};
</script>
