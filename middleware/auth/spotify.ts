import { useAuthStore } from "@/src/stores/auth";
import { getAccessTokenFromUrl } from "@/src/services/auth/spotify/token";
import { useCookie, useRequestEvent } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isServer = !!useRequestEvent();

  let hash = "";
  if (!isServer) {
    hash = window.location.hash;
  } else {
    hash = to.hash;
  }

  const authStore = useAuthStore();

  const tokenData = getAccessTokenFromUrl(hash);

  if (tokenData?.accessToken) {
    authStore.token = tokenData.accessToken;
    const tokenCookie = useCookie("spotify_token");
    tokenCookie.value = tokenData.accessToken;

    await authStore.fetchSpotifyUser();
    return;
  }

  const tokenCookie = useCookie("spotify_token");
  if (tokenCookie.value) {
    authStore.token = tokenCookie.value;

    await authStore.fetchSpotifyUser();
    return;
  }

  if (!authStore.token) {
    return navigateTo("/accounts/login");
  }
});
