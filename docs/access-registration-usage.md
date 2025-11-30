# Guía de Uso: Registro de Ingresos y Salidas

## Explicación del Sistema

### 1. **Arquitectura de Capas**

```
Componente Vue
    ↓
useAccessStore (Store Pinia)
    ↓
AccessService (Servicio)
    ↓
API Backend (/api/ubicacioneventoes/)
```

### 2. **Flujo de Datos**

**Ingreso (Entrada - E):**

1. Usuario escanea código QR/DNI
2. Componente obtiene datos del ticket
3. Llama a `accessStore.registerEntry(ticketData)`
4. Store convierte datos y llama a `AccessService.registerAccess()` con `ingreso: "E"`
5. Servicio hace PUT al endpoint con el token
6. Retorna resultado: `{ success: true/false, message: "..." }`

**Salida (S):**

- Mismo flujo pero con `accessStore.registerExit(ticketData)` y `ingreso: "S"`

### 3. **Tipos de Escaneo**

| Tipo                          | Comportamiento                  | Método a usar                                       |
| ----------------------------- | ------------------------------- | --------------------------------------------------- |
| `"continuo ingreso"`          | Siempre registra entrada        | `registerEntry()` o `registerAutoAccess()`          |
| `"continuo salida"`           | Siempre registra salida         | `registerExit()` o `registerAutoAccess()`           |
| `"preguntar"`                 | Pregunta al usuario (manual)    | `registerEntry()` o `registerExit()` según elección |
| `"continuo ingreso y salida"` | Alterna automático según estado | `registerAutoAccess()`                              |

## Código de Ejemplo

### Ejemplo 1: Registro Manual (Botones)

```vue
<template>
  <div>
    <!-- Botones para elegir acción -->
    <button
      @click="handleEntry"
      :disabled="accessStore.isRegistering"
      class="btn btn-primary"
    >
      {{ accessStore.isRegistering ? "Registrando..." : "Registrar Entrada" }}
    </button>

    <button
      @click="handleExit"
      :disabled="accessStore.isRegistering"
      class="btn btn-secondary"
    >
      {{ accessStore.isRegistering ? "Registrando..." : "Registrar Salida" }}
    </button>

    <!-- Mensaje de resultado -->
    <div
      v-if="accessStore.lastRegistrationResult"
      :class="
        accessStore.lastRegistrationResult.success
          ? 'alert-success'
          : 'alert-error'
      "
      class="alert mt-4"
    >
      {{ accessStore.lastRegistrationResult.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccessStore } from "~/src/stores/paseshow/access";

const accessStore = useAccessStore();

// Datos del ticket que obtuviste del escaneo
const scannedTicket = ref<any>(null);

const handleEntry = async () => {
  if (!scannedTicket.value) {
    console.warn("No hay ticket escaneado");
    return;
  }

  // Registrar entrada a través del store
  const result = await accessStore.registerEntry(scannedTicket.value);

  if (result.success) {
    console.log("✅ Entrada registrada:", result.message);
    // Aquí puedes actualizar UI, mostrar notificación, etc.
  } else {
    console.error("❌ Error al registrar entrada:", result.message);
  }
};

const handleExit = async () => {
  if (!scannedTicket.value) {
    console.warn("No hay ticket escaneado");
    return;
  }

  // Registrar salida a través del store
  const result = await accessStore.registerExit(scannedTicket.value);

  if (result.success) {
    console.log("✅ Salida registrada:", result.message);
  } else {
    console.error("❌ Error al registrar salida:", result.message);
  }
};
</script>
```

### Ejemplo 2: Registro Automático

```vue
<template>
  <div>
    <div class="scanner-container">
      <!-- Tu componente de scanner aquí -->
      <CameraView @scan-success="handleScan" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccessStore } from "~/src/stores/paseshow/access";

const accessStore = useAccessStore();

const handleScan = async (ticketData: any) => {
  console.log("📷 Código escaneado:", ticketData);

  // Opción A: Registro automático según configuración
  const result = await accessStore.registerAutoAccess(ticketData);

  if (result === null) {
    // Modo "preguntar" - mostrar botones de elección
    console.log("🤔 Modo preguntar: mostrar opciones al usuario");
    // Aquí abres un modal o mostras botones
    return;
  }

  // Opción B: Registro manual específico
  // const result = await accessStore.registerEntry(ticketData); // Para entrada
  // const result = await accessStore.registerExit(ticketData);  // Para salida

  if (result.success) {
    console.log("✅", result.message);
    // Mostrar feedback visual al usuario
  } else {
    console.error("❌", result.message);
    // Mostrar error al usuario
  }
};
</script>
```

### Ejemplo 3: Verificar Estado del Store

```vue
<script setup lang="ts">
import { useAccessStore } from "~/src/stores/paseshow/access";

const accessStore = useAccessStore();

// Verificar si hay token válido
if (!accessStore.hasValidToken) {
  console.warn("⚠️ No hay token válido");
  // Redirigir a login o mostrar error
}

// Verificar modo offline
if (accessStore.isOfflineMode) {
  console.log("📴 Modo offline activado");
}

// Obtener configuración de botones
const buttonsConfig = accessStore.getButtonsConfig();
console.log("🎛️ Configuración de botones:", buttonsConfig);
// { showEntry: true, showExit: true, autoAction: "preguntar" }
</script>
```

## Estructura de Datos

### ticketData (entrada del método)

```typescript
{
  id: 123,
  dni: "12345678",
  ingreso: "N",  // N=nuevo, E=adentro, S=afuera (estado actual)
  sectorEventoId: {
    id: "456"
  },
  descuentoSectorId: {
    descripcion: "Entrada general",
    porcentaje: 0
  }
  // ... otros campos
}
```

### Resultado del registro

```typescript
{
  success: boolean,
  message: string
  // Ejemplos:
  // { success: true, message: "INGRESO REGISTRADO CORRECTAMENTE" }
  // { success: false, message: "ERROR: Token no válido" }
}
```

## Mejores Prácticas

1. **Siempre verificar el token antes de registrar:**

   ```typescript
   if (!accessStore.hasValidToken) {
     // Manejar error
   }
   ```

2. **Usar `isRegistering` para deshabilitar UI:**

   ```vue
   <button :disabled="accessStore.isRegistering">
     Registrar
   </button>
   ```

3. **Mostrar resultado al usuario:**

   ```typescript
   const result = await accessStore.registerEntry(ticket);
   if (result.success) {
     // Mostrar notificación de éxito
   } else {
     // Mostrar mensaje de error
   }
   ```

4. **Limpiar resultado previo si es necesario:**
   ```typescript
   accessStore.lastRegistrationResult = null;
   ```

## Preguntas Frecuentes

**¿Cuándo usar `registerEntry` vs `registerAutoAccess`?**

- `registerEntry/Exit`: Cuando el usuario elige manualmente (botones)
- `registerAutoAccess`: Cuando quieres comportamiento automático según configuración

**¿Qué pasa si no hay conexión?**

- El servicio retornará `{ success: false, message: "ERROR: Error de conexión" }`
- Puedes verificar `accessStore.isOfflineMode` antes de intentar

**¿Cómo cambio el tipo de escaneo?**

```typescript
accessStore.setScanType("continuo ingreso");
```

**¿Dónde se guarda el token?**

```typescript
accessStore.setToken("tu-token-aqui");
```
