/\*\*

- GUÍA DE MIGRACIÓN - STORES DE SELECCIÓN
-
- Esta es una guía para migrar del sistema anterior al nuevo sistema basado en SOLID
  \*/

// =====================================
// ANTES (stores separados)
// =====================================

// Imports antiguos
// import { useSelectedDatesStore } from "~/src/stores/paseshow/selectedDates";
// import { useSelectedSectorsStore } from "~/src/stores/paseshow/selectedSectors";

// =====================================
// DESPUÉS (sistema unificado con SOLID)
// =====================================

// Nuevos imports
import {
useSelectedDatesStore,
useSelectedSectorsStore,
type DateSelectionKey,
type SectorSelectionKey
} from "~/src/stores/paseshow/selections";

/\*\*

- VENTAJAS del nuevo sistema:
-
- 1.  SINGLE RESPONSIBILITY PRINCIPLE
- - Cada clase tiene una responsabilidad específica
- - BaseSelectionStore: lógica común de selección
- - DateSelectionManager: lógica específica de fechas
- - SectorSelectionManager: lógica específica de sectores
-
- 2.  OPEN/CLOSED PRINCIPLE
- - Fácil agregar nuevos tipos de selección (ej: venues, artists)
- - Sin modificar código existente
-
- 3.  LISKOV SUBSTITUTION PRINCIPLE
- - Cualquier implementación puede reemplazar a BaseSelectionStore
- - Comportamiento consistente
-
- 4.  INTERFACE SEGREGATION PRINCIPLE
- - Interfaces específicas (DateSelectionKey, SectorSelectionKey)
- - No dependencias innecesarias
-
- 5.  DEPENDENCY INVERSION PRINCIPLE
- - Pinia stores dependen de abstracciones (clases)
- - No de implementaciones concretas
    \*/

// =====================================
// EJEMPLO DE USO (sin cambios en la API)
// =====================================

export function exampleUsage() {
const datesStore = useSelectedDatesStore();
const sectorsStore = useSelectedSectorsStore();

// La API sigue igual - sin breaking changes
datesStore.toggleDate("eventId", 1234567890);
sectorsStore.toggleSector("eventId", 1234567890, "sectorId");

// Nuevas capacidades gracias a SOLID
console.log("Total fechas:", datesStore.selectedCount);
console.log("Total sectores:", sectorsStore.selectedCount);
}

// =====================================
// MIGRACIÓN GRADUAL
// =====================================

/\*\*

- PASO 1: Los stores actuales seguirán funcionando
- PASO 2: Cambiar imports gradualmente
- PASO 3: Eliminar stores antiguos cuando todo esté migrado
-
- NO HAY BREAKING CHANGES - La API pública es idéntica
  \*/
