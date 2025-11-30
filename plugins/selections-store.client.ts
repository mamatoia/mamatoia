export default defineNuxtPlugin(async () => {
  // Solo ejecutar en el cliente
  if (typeof window !== "undefined") {
    // Inicializar el store de selections desde localStorage
    const { useSelectionsStore } = await import(
      "~/src/stores/paseshow/selections"
    );
    const selections = useSelectionsStore();
    selections.initializeFromStorage();
  }
});
