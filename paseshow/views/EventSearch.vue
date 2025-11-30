<template>
  <PanelContainer bgClass="panel-bg">
    <template #header>
      <AppHeader
        title=""
        :show-search="false"
        :show-avatar="false"
        :show-scanner="false"
      >
        <!-- Botón volver en el slot left -->
        <template #left>
          <BackButton />
        </template>
      </AppHeader>

      <!-- Campo de búsqueda debajo del header -->
      <SearchField
        placeholder="Buscar eventos por nombre..."
        :auto-focus="true"
        @change="searchQuery = $event"
      />
    </template>

    <!-- Resultados de búsqueda -->
    <SearchResultsPanel :query="searchQuery" :is-searching="isSearching" />
  </PanelContainer>
</template>

<script setup>
import { ref } from "vue";
import PanelContainer from "../containers/PanelContainer.vue";
import SearchResultsPanel from "../widgets/SearchResultsPanel.vue";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/ui/buttons/BackButton.vue";
import SearchField from "../components/ui/fieldset/SearchField.vue";

const searchQuery = ref("");
const isSearching = ref(false);

// SearchField component handles auto-focus
</script>
