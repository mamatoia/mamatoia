<template>
  <DrawerMenu
    toggle-id="events-drawer"
    side="start"
    :use-default-side="true"
    panel-class="bg-base-300"
    @logout="onLogout"
  >
    <template #content>
      <PanelContainer
        bgClass="panel-bg"
        :allow-refresh="true"
        @refresh="refrescar"
      >
        <template #header>
          <AppHeader
            title="Eventos"
            :show-search="true"
            :show-avatar="false"
            @search-click="onSearchClick"
          >
            <template #left>
              <label
                for="events-drawer"
                class="btn btn-ghost btn-circle p-1 text-base-content"
                aria-label="Abrir menú"
              >
                <div class="avatar">
                  <div class="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="https://api.dicebear.com/9.x/dylan/svg?backgroundColor=c0aede"
                      alt="Avatar General"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </label>
            </template>
          </AppHeader>
          <TabFilter
            v-model:active-tab="activeTab"
            :primary-tab="{ key: 'todos', label: 'Todos' }"
            :secondary-tabs="[{ key: 'favoritos', label: 'Favoritos' }]"
          />
        </template>
        <EventsPanel
          ref="eventsPanelRef"
          :favorites-only="activeTab === 'favoritos'"
        />
      </PanelContainer>
    </template>
  </DrawerMenu>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import DrawerMenu from "../components/ui/menu/DrawerMenu.vue";
import PanelContainer from "../containers/PanelContainer.vue";
import EventsPanel from "../widgets/EventsPanel.vue";
import TabFilter from "../components/TabFilter.vue";
import AppHeader from "../components/AppHeader.vue";
import { useAuthStore } from "~/src/stores/auth";

const router = useRouter();
const auth = useAuthStore();

// Controla la pestaña activa: 'todos' | 'favoritos'
const activeTab = ref("todos");

// Restore active tab from localStorage so tab selection persists across navigation
onMounted(() => {
  try {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("events-active-tab")
        : null;
    if (saved === "todos" || saved === "favoritos") {
      activeTab.value = saved;
    }
  } catch (e) {
    // ignore
  }
});

const eventsPanelRef = ref<any>(null);

const refrescar = async () => {
  // Dispara el refresh del panel de eventos expuesto por el hijo
  await eventsPanelRef.value?.handleRefresh?.();
};

watch(activeTab, (val) => {
  try {
    if (typeof window !== "undefined")
      localStorage.setItem("events-active-tab", val);
  } catch (e) {
    // ignore
  }
});

// Función de búsqueda
const onSearchClick = () => {
  router.push("/eventos/buscar");
};

// Header manejado por AppHeader

// Logout y redirección a ingreso
const onLogout = () => {
  try {
    auth.logout();
  } catch (e) {
    // noop
  }
  // Cerrar el drawer si está abierto
  const drawer = document.getElementById(
    "events-drawer"
  ) as HTMLInputElement | null;
  if (drawer) drawer.checked = false;
  router.push("/ingreso");
};
</script>
