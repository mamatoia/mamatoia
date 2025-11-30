<template>
  <div :class="['drawer', sideClass, 'min-h-screen']">
    <input :id="toggleId" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content">
      <slot name="content" />
    </div>

    <div class="drawer-side z-[1400] min-h-screen">
      <label
        :for="toggleId"
        aria-label="close sidebar"
        class="drawer-overlay z-[1300]"
      ></label>

      <!-- Slot lateral personalizado -->
      <div class="relative z-[1400]" v-if="hasSideSlot">
        <slot name="side" />
      </div>

      <!-- Menú lateral por defecto (opcional) -->
      <template v-else-if="useDefaultSide">
        <div class="relative z-[1400] h-full">
          <!-- Panel completo con fondo para evitar transparencias -->
          <div
            :class="[
              'w-80 min-h-full',
              borderClass,
              'border-base-300 shadow-xl flex flex-col',
              panelClassComputed,
            ]"
          >
            <!-- Header fijo arriba: avatar + nombre hacen click y van a /perfiles -->
            <NuxtLink
              to="/perfiles"
              class="p-4 pb-3 flex items-center gap-3 group"
              @click="closeDrawer"
            >
              <div class="avatar">
                <div class="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src="https://api.dicebear.com/9.x/dylan/svg?backgroundColor=c0aede"
                    alt="Avatar General"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div class="flex flex-col leading-tight">
                <div
                  class="text-base font-semibold truncate max-w-[10rem] group-hover:text-base-content"
                >
                  Miguel
                </div>
                <div class="text-sm text-base-content/60">Ver perfil</div>
              </div>
            </NuxtLink>
            <hr class="my-2 border-primary" />

            <!-- Menú scrollable ocupa el resto -->
            <ul class="menu flex-1 overflow-y-auto p-4">
              <li>
                <NuxtLink
                  to="/general"
                  class="flex items-center gap-2 pb-5"
                  @click="closeDrawer"
                >
                  <UiIcon name="heroicons:cog-6-tooth" class="w-6 h-6" />
                  <span class="text-base">Configuración General</span>
                </NuxtLink>
              </li>

              <li>
                <a
                  role="button"
                  class="flex items-center gap-2"
                  @click.prevent="onClickLogout"
                >
                  <UiIcon name="heroicons:arrow-up-tray" class="w-6 h-6" />
                  <span class="text-base">Salir</span>
                </a>
              </li>
            </ul>

            <!-- ThemeController fijo en la parte inferior -->
            <div class="p-4 pt-2 border-t border-base-300">
              <ThemeController />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from "vue";
import UiIcon from "~/components/ui/Icon.vue";
import ThemeController from "../ThemeController.vue";

interface Props {
  toggleId: string;
  side?: "start" | "end";
  useDefaultSide?: boolean;
  panelClass?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: "logout"): void }>();

const sideClass = computed(() =>
  props.side === "end" ? "drawer-end" : "drawer-start"
);

// Adjust border side depending on where the drawer opens from
const borderClass = computed(() =>
  props.side === "end" ? "border-l" : "border-r"
);

const slots = useSlots();
const hasSideSlot = computed(() => Boolean(slots.side));

import { onMounted, ref } from "vue";

const currentTheme = ref("");

onMounted(() => {
  if (typeof document !== "undefined") {
    currentTheme.value =
      document.documentElement.getAttribute("data-theme") || "";
  }
});

const panelClassComputed = computed(() => {
  const requested = (props.panelClass || "").toString();
  if (currentTheme.value === "light") {
    return "bg-base-300";
  }
  if (requested && requested !== "panel-bg") return requested;
  return requested || "bg-base-200";
});

const closeDrawer = () => {
  const el = document.getElementById(props.toggleId) as HTMLInputElement | null;
  if (el) el.checked = false;
};

const onClickLogout = () => {
  closeDrawer();
  emit("logout");
};
</script>

<style scoped></style>
