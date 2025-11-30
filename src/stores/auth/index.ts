import { defineStore } from "pinia";
import { redirectToSpotify } from "~/src/services/auth/spotify/token";
import { fetchSpotifyUser } from "~/src/services/auth/spotify/user";
import { fetchLogin } from "~/src/services/auth/paseshow/token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as { name: string; email: string } | null,
    token: null as string | null,
  }),
  actions: {
    login(user: { name: string; email: string }, token: string) {
      this.user = user;
      this.token = token;
    },
    redirectToSpotify: () => {
      const authUrl = redirectToSpotify();
      window.location.href = authUrl;
    },
    logout() {
      this.user = null;
      this.token = null;
      // Eliminar cookie del token
      const tokenCookie = useCookie("token");
      tokenCookie.value = null;
    },
    async fetchSpotifyUser() {
      const user = await fetchSpotifyUser(this.token as string);

      if (user) {
        this.user = {
          name: user.display_name,
          email: user.email,
        };
      }
    },
    async loginPaseshow(username: string, password: string) {
      const result = await fetchLogin(username, password);
      return result;
    },
  },
});
