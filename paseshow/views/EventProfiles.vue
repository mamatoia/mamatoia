<template>
  <PanelContainer bgClass="panel-bg">
    <template #header>
      <AppHeader title="Perfiles" :show-search="false">
        <template #left>
          <BackButton />
        </template>
      </AppHeader>
    </template>
    <ProfilePanel />
  </PanelContainer>
</template>
<script setup>
import PanelContainer from "../containers/PanelContainer.vue";
import ProfilePanel from "../widgets/ProfilePanel.vue";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/ui/buttons/BackButton.vue";
</script>
