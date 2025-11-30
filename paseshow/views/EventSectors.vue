<template>
  <PanelContainer bgClass="panel-bg">
    <template #header>
      <AppHeader title="Sectores">
        <template #left>
          <BackButton />
        </template>
      </AppHeader>
      <PFilterSection
        label="Todos"
        bg-class="bg-base-100"
        underline-class="bg-accent"
      >
        <!-- sin controles por ahora -->
      </PFilterSection>
    </template>
    <SectorsPanel />
  </PanelContainer>
</template>

<script setup>
import PanelContainer from "../containers/PanelContainer.vue";
import SectorsPanel from "../widgets/SectorsPanel.vue";
import PFilterSection from "../components/FilterSection.vue";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/ui/buttons/BackButton.vue";
// BackButton component handles navigation
</script>
