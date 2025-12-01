import { defineStore } from "pinia";
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

    logout() {
      this.user = null;
      this.token = null;
      // Eliminar cookie del token
      const tokenCookie = useCookie("token");
      tokenCookie.value = null;
    },

    async loginPaseshow(username: string, password: string) {
      const result = await fetchLogin(username, password);
      return result;
    },
  },
});
