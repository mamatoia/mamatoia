import { useAuthStore } from "@/src/stores/auth";
import { useCookie, useRequestEvent } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isServer = !!useRequestEvent();

  const authStore = useAuthStore();
  const tokenCookie = useCookie("token");
  if (tokenCookie.value) {
    authStore.token = tokenCookie.value;
  }

  // Verificando token de autenticación

  // Si ya está autenticado y está en /ingreso, redirigir a /eventos
  if (authStore.token && to.path === "/ingreso") {
    return navigateTo("/eventos");
  }

  // Si no está autenticado y no está en /ingreso, redirigir a /ingreso
  if (!authStore.token && to.path !== "/ingreso") {
    return navigateTo("/ingreso");
  }
});
