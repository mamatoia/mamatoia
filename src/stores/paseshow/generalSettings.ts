import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface GeneralSettingsState {
  terminal: string;
  contador: string;
  vencimiento: string;
  servidorPrimario: string;
  servidorSecundario: string;
  tipoDeEscaneo: string;
  usuarioPorDefecto: string;
  clavePorDefecto: string;
  filtroDeDescuentos: string;
  habilitarNFC: boolean;
  modoOnline: boolean;
  sincronizar: boolean;
}

export const useGeneralSettingsStore = defineStore("generalSettings", () => {
  // State
  const terminal = ref("");
  const contador = ref("");
  const vencimiento = ref("");
  const servidorPrimario = ref("https://api.paseshow.com.ar/");
  const servidorSecundario = ref("https://api.paseshow.com.ar/");
  const tipoDeEscaneo = ref("continuo ingreso");
  const usuarioPorDefecto = ref("");
  const clavePorDefecto = ref("");
  const filtroDeDescuentos = ref("sin filtrar");
  const habilitarNFC = ref(false);
  const modoOnline = ref(false);
  const sincronizar = ref(false);

  // Actions
  const updateSettings = (settings: Partial<GeneralSettingsState>) => {
    if (settings.terminal !== undefined) terminal.value = settings.terminal;
    if (settings.contador !== undefined) contador.value = settings.contador;
    if (settings.vencimiento !== undefined)
      vencimiento.value = settings.vencimiento;
    if (settings.servidorPrimario !== undefined)
      servidorPrimario.value = settings.servidorPrimario;
    if (settings.servidorSecundario !== undefined)
      servidorSecundario.value = settings.servidorSecundario;
    if (settings.tipoDeEscaneo !== undefined)
      tipoDeEscaneo.value = settings.tipoDeEscaneo;
    if (settings.usuarioPorDefecto !== undefined)
      usuarioPorDefecto.value = settings.usuarioPorDefecto;
    if (settings.clavePorDefecto !== undefined)
      clavePorDefecto.value = settings.clavePorDefecto;
    if (settings.filtroDeDescuentos !== undefined)
      filtroDeDescuentos.value = settings.filtroDeDescuentos;
    if (settings.habilitarNFC !== undefined)
      habilitarNFC.value = settings.habilitarNFC;
    if (settings.modoOnline !== undefined)
      modoOnline.value = settings.modoOnline;
    if (settings.sincronizar !== undefined)
      sincronizar.value = settings.sincronizar;
  };

  const resetToDefaults = () => {
    terminal.value = "";
    contador.value = "";
    vencimiento.value = "";
    servidorPrimario.value = "https://api.paseshow.com.ar/";
    servidorSecundario.value = "https://api.paseshow.com.ar/";
    tipoDeEscaneo.value = "continuo ingreso";
    usuarioPorDefecto.value = "";
    clavePorDefecto.value = "";
    filtroDeDescuentos.value = "sin filtrar";
    habilitarNFC.value = false;
    modoOnline.value = false;
    sincronizar.value = false;
  };

  const saveToStorage = () => {
    if (typeof window !== "undefined") {
      const settings = {
        terminal: terminal.value,
        contador: contador.value,
        vencimiento: vencimiento.value,
        servidorPrimario: servidorPrimario.value,
        servidorSecundario: servidorSecundario.value,
        tipoDeEscaneo: tipoDeEscaneo.value,
        usuarioPorDefecto: usuarioPorDefecto.value,
        clavePorDefecto: clavePorDefecto.value,
        filtroDeDescuentos: filtroDeDescuentos.value,
        habilitarNFC: habilitarNFC.value,
        modoOnline: modoOnline.value,
        sincronizar: sincronizar.value,
      };
      localStorage.setItem(
        "paseshow-general-settings",
        JSON.stringify(settings)
      );
    }
  };

  const loadFromStorage = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("paseshow-general-settings");
      if (stored) {
        try {
          const settings = JSON.parse(stored) as Partial<GeneralSettingsState>;
          updateSettings(settings);
        } catch (error) {
          console.error("Error loading settings from storage:", error);
        }
      }
    }
  };

  const clearStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("paseshow-general-settings");
    }
  };

  // Getters
  const isComplete = computed(() => {
    return !!(
      terminal.value &&
      contador.value &&
      vencimiento.value &&
      usuarioPorDefecto.value &&
      clavePorDefecto.value
    );
  });

  const serverConfig = computed(() => ({
    primary: servidorPrimario.value,
    secondary: servidorSecundario.value,
  }));

  const authConfig = computed(() => ({
    username: usuarioPorDefecto.value,
    password: clavePorDefecto.value,
  }));

  const scannerConfig = computed(() => ({
    type: tipoDeEscaneo.value,
    timeout: vencimiento.value,
    nfcEnabled: habilitarNFC.value,
  }));

  const networkConfig = computed(() => ({
    online: modoOnline.value,
    sync: sincronizar.value,
  }));

  return {
    // State
    terminal,
    contador,
    vencimiento,
    servidorPrimario,
    servidorSecundario,
    tipoDeEscaneo,
    usuarioPorDefecto,
    clavePorDefecto,
    filtroDeDescuentos,
    habilitarNFC,
    modoOnline,
    sincronizar,
    // Actions
    updateSettings,
    resetToDefaults,
    saveToStorage,
    loadFromStorage,
    clearStorage,
    // Getters
    isComplete,
    serverConfig,
    authConfig,
    scannerConfig,
    networkConfig,
  };
});
