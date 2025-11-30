<template>
  <PanelContainer bgClass="panel-bg">
    <template #header>
      <AppHeader
        title="Escaner"
        :show-search="false"
        :show-scanner="false"
        :show-avatar="false"
      >
        <template #left>
          <BackButton />
        </template>
        <template #right>
          <label for="scanner-drawer" class="icon-btn" aria-label="Abrir menú">
            <UiIcon
              name="outline:ellipsis-vertical"
              class="w-5 h-5 pointer-events-none"
            />
          </label>
        </template>
      </AppHeader>
    </template>

    <ScannerDrawer @logout="onLogout">
      <div class="flex flex-col h-full">
        <ScannerPanel />
        <TicketsPanel />
      </div>
    </ScannerDrawer>
  </PanelContainer>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PanelContainer from "../containers/PanelContainer.vue";
import ScannerPanel from "../components/ScannerPanel/index.vue";
import TicketsPanel from "../widgets/TicketsPanel/index.vue";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/ui/buttons/BackButton.vue";
import UiIcon from "@/components/ui/Icon.vue";
import ScannerDrawer from "../components/ui/menu/ScannerDrawer.vue";
import { useAuthStore } from "~/src/stores/auth";
import { useAccessStore } from "~/src/stores/paseshow/access";
import { useSelectionsStore } from "~/src/stores/paseshow/selections";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const accessStore = useAccessStore();

// Validar parámetros necesarios e inicializar token
onMounted(() => {
  const { evento, fecha, sector } = route.query;

  // Set token in access store
  if (auth.token) {
    accessStore.setToken(auth.token);
    console.log("[Scanner] Token configurado en accessStore");
  } else {
    console.warn("[Scanner] No hay token disponible en authStore");
  }

  // Populate active sectors in accessStore from either the route query or current selections
  const selections = useSelectionsStore();
  // Prefer explicit `sector` query param; allow comma-separated lists
  let sectors: string[] = [];
  if (sector) {
    const s = sector.toString();
    sectors = s.includes(",") ? s.split(",").map((x) => x.trim()) : [s];
  } else {
    const sel = selections.getSelectionContext();
    if (sel && Array.isArray(sel.selectedSectors) && sel.selectedSectors.length)
      sectors = sel.selectedSectors.map((s) => s.toString());
  }

  if (sectors.length > 0) {
    accessStore.setActiveSectors(sectors);
    console.log("[Scanner] Active sectors set:", sectors);
  } else {
    console.warn(
      "[Scanner] No hay sectores activos: asegúrese de seleccionar sectores o pasar 'sector' en la URL"
    );
  }
});

const onLogout = async () => {
  try {
    await auth.logout?.();
  } finally {
    router.push("/ingreso");
  }
};
</script>
