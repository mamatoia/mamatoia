<template>
  <PanelContainer bgClass="panel-bg">
    <template #header>
      <AppHeader title="Fechas">
        <template #left>
          <BackButton />
        </template>
      </AppHeader>
      <PFilterSection
        label="Todos"
        bg-class="bg-base-100"
        underline-class="bg-secondary"
      >
        <!-- sin controles por ahora -->
      </PFilterSection>
    </template>
    <DatesPanel />
  </PanelContainer>
</template>

<script setup lang="ts">
import PanelContainer from "../containers/PanelContainer.vue";
import DatesPanel from "../widgets/DatesPanel.vue";
import PFilterSection from "../components/FilterSection.vue";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/ui/buttons/BackButton.vue";

// BackButton component handles navigation
</script>
