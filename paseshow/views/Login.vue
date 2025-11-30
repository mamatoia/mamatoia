<template>
  <div class="flex justify-center">
    <LoginContainer>
      <div class="flex justify-center items-start">
        <LogoTransparente />
      </div>
      <LoginPaseshow />
    </LoginContainer>
  </div>
</template>

<script setup>
import LogoTransparente from "../components/LogoTransparente.vue";
import LoginContainer from "../containers/LoginContainer.vue";
import LoginPaseshow from "../widgets/LoginPaseshow.vue";
</script>
