import { defineStore } from "pinia";

export const useProfileStore = defineStore("auth", {
  state: () => ({
    profile: {
      id: 0,
      email: "",
      sexo: "",
      fechaNacimiento: "",

      pais: "",
      compartirDatos: false,
    },
  }),
  getters: {
    getProfile: (state) => () => {
      return state.profile;
    },
  },

  actions: {
    save(profile: any) {
      this.profile.email = profile.email;
      this.profile.sexo = profile.sexo;
      this.profile.fechaNacimiento = profile.fechaNacimiento;

      this.profile.pais = profile.pais;
      this.profile.compartirDatos = profile.compartirDatos;
    },
    cancel() {},
  },
});
