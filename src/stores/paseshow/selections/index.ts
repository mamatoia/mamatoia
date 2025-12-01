/**
 * Punto de entrada unificado para todas las selecciones
 * Facilita el import y mantiene la interfaz limpia
 */

export {
  BaseSelectionStore,
  type SelectionKey,
  type SelectionState,
} from "./base";
export { useSelectedDatesStore, type DateSelectionKey } from "./dates";
export { useSelectedSectorsStore, type SectorSelectionKey } from "./sectors";
