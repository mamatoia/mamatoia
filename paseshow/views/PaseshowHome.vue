<template>
  <div class="flex justify-center">
    <LoginContainer class="min-h-96 md:min-h-[28rem]" bgClass="bg-transparent">
      <div class="h-full flex flex-col justify-center items-center w-full">
        <div class="flex justify-center items-center w-60">
          <LogoTransparente />
        </div>

        <div class="mt-20">
          <StackedButton
            to="/ingreso"
            icon="heroicons:qr-code"
            label="Escáner de Tickets v2.1.10-demo"
            aria-label="Escáner de Tickets"
          />
        </div>
      </div>
    </LoginContainer>
  </div>
</template>

<script setup>
import LogoTransparente from "~/paseshow/components/LogoTransparente.vue";
import LoginContainer from "~/paseshow/containers/LoginContainer.vue";
import StackedButton from "~/paseshow/components/ui/buttons/StackedButton.vue";
</script>
