# Scanner Integration - Access Registration System

## Resumen de Implementación

Se ha integrado el sistema de registro de accesos (ingresos/salidas) en el componente `ScannerPanel` con validación de estados y códigos de colores según el modo de escaneo configurado.

## Archivos Modificados

### 1. `src/stores/paseshow/access.ts`

- **Nueva función**: `validateTicketState(ticketData, actionType)`
  - Valida si la acción (entrada/salida) es permitida según el estado actual del ticket
  - Retorna: `{ isValid, color, message }`
- **Actualizado**: `registerEntry()` y `registerExit()`
  - Ahora incluyen validación y retornan `color` e `isValid` en el resultado
- **Existente**: `registerAutoAccess()`
  - Enruta a entrada/salida según `scanType` configurado
  - Retorna `null` para modo "preguntar" (requiere acción manual)

### 2. `paseshow/components/ScannerPanel/services/scanService.js`

- **Actualizado**: `registrarAcceso()`
  - Ahora usa `useAccessStore()` en lugar de implementación dummy
  - Parámetros nuevos: `ticketData`, `forceAction`
  - `forceAction`: "E" para forzar entrada, "S" para forzar salida, `undefined` para automático
  - Retorna: `{ ok, mensaje, color, isValid, requiresAction }`
  - `requiresAction: true` indica que se necesita acción manual (modo "preguntar")

### 3. `paseshow/components/ScannerPanel/index.vue`

- **Nuevas variables reactivas**:

  - `showManualButtons`: Muestra botones Ingresar/Salir en modo "preguntar"
  - `processingManual`: Evita clicks duplicados en botones manuales
  - `pendingTicketData`: Almacena datos del ticket para acciones manuales
  - `messageColor`: Color de fondo del mensaje según resultado

- **Actualizado**: `onScan()`

  - Pasa `ticketData` a `registrarAcceso()`
  - Aplica `messageColor` según resultado
  - Muestra botones manuales si `requiresAction === true`
  - Reproduce beep/vibración solo para registros válidos (`isValid !== false`)

- **Nuevas funciones**: `handleManualEntry()` y `handleManualExit()`

  - Llaman a `registrarAcceso()` con `forceAction: "E"` o `"S"`
  - Ocultan botones después de la acción
  - Reproducen feedback solo si es válido

- **Actualizado**: `clearScan()`

  - Limpia también `messageColor`, `showManualButtons`, `pendingTicketData`

- **Template actualizado**:
  - `ScanMessage` ahora recibe prop `color`
  - Nuevos botones "Ingresar" y "Salir" mostrados condicionalmente

### 4. `paseshow/components/ScannerPanel/ScanMessage.vue`

- **Nueva prop**: `color`
- **Actualizado**: Clases dinámicas aplicadas con `:class` binding
- Fallback a `bg-black/60 text-white` si no se proporciona color

## Lógica de Validación y Colores

### Modos de Escaneo

#### 1. **Continuo Ingreso** (`scanType: "continuo ingreso"`)

- Si `ingreso === "E"` → ❌ **ROJO** (`bg-error text-error-content`) - "Ya está adentro"
- De lo contrario → ✅ **VERDE** (`bg-success text-success-content`) - "Ingreso registrado"

#### 2. **Continuo Salida** (`scanType: "continuo salida"`)

- Si `ingreso === "S"` → ❌ **ROJO** (`bg-error text-error-content`) - "Ya salió"
- De lo contrario → ✅ **CELESTE** (`bg-info text-info-content`) - "Salida registrada"

#### 3. **Continuo Ingreso y Salida** (`scanType: "continuo ingreso y salida"`)

- Si `ingreso === "E"` → Registra **salida** (CELESTE)
- Si `ingreso !== "E"` → Registra **entrada** (VERDE)
- Combina las validaciones de ambos modos

#### 4. **Preguntar** (`scanType: "preguntar"`)

- No hace registro automático
- Muestra botones **Ingresar** (verde) y **Salir** (celeste)
- Usuario elige manualmente la acción
- Cada botón aplica su propia validación al presionarse

### Estados del Ticket

- `ingreso: "E"` → Persona está adentro (último registro fue entrada)
- `ingreso: "S"` → Persona está afuera (último registro fue salida)
- `ingreso: "N"` → Persona nueva (sin registros previos)

## Flujo de Uso

### Modo Automático (continuo ingreso, continuo salida, continuo ingreso y salida)

1. Usuario escanea QR
2. `consultarQR()` obtiene datos del ticket
3. `registrarAcceso()` llama a `accessStore.registerAutoAccess()`
4. Store valida estado y retorna color según resultado
5. Mensaje se muestra con color apropiado
6. Si es válido → beep/vibración

### Modo Manual (preguntar)

1. Usuario escanea QR
2. `consultarQR()` obtiene datos del ticket
3. `registrarAcceso()` detecta modo "preguntar" y retorna `requiresAction: true`
4. Se muestran botones "Ingresar" y "Salir"
5. Usuario presiona botón deseado
6. Se llama a `registrarAcceso()` con `forceAction: "E"` o `"S"`
7. Validación y feedback según resultado

## Ejemplos de Mensajes

### Exitosos

- ✅ **VERDE**: "Ingreso registrado" (entrada válida)
- ✅ **CELESTE**: "Salida registrada" (salida válida)

### Errores

- ❌ **ROJO**: "Ya está adentro" (intento de entrada cuando ingreso=E)
- ❌ **ROJO**: "Ya salió" (intento de salida cuando ingreso=S)
- ⚠️ **AMARILLO**: "Escaneo ya registrado recientemente" (deduplicación)
- ⚠️ **AMARILLO**: "Seleccione acción (Ingresar o Salir)" (modo preguntar)

## Consideraciones Técnicas

### Deduplicación

- Ventana de 10 segundos para evitar escaneos duplicados del mismo código
- Se preserva la lógica existente en `onScan()`
- `registrationsMap` evita llamadas duplicadas a la API

### Manejo de Errores

- Try-catch en todos los handlers asíncronos
- Mensajes de error con color rojo
- Logs en consola para debugging

### Token de Autenticación

- El `accessStore` debe tener el token configurado
- Se puede obtener del `authStore` o de route params
- Actualmente se espera que esté configurado antes de usar el scanner

### Feedback Sensorial

- Beep y vibración solo se reproducen para registros válidos
- No se reproduce para errores (color rojo)
- Configuración persiste en localStorage

## Testing Recomendado

1. **Modo Continuo Ingreso**:

   - Escanear ticket nuevo → debe ser VERDE
   - Escanear mismo ticket (ya adentro) → debe ser ROJO
   - Esperar 10s y escanear de nuevo → debe ser ROJO

2. **Modo Continuo Salida**:

   - Escanear ticket que está adentro → debe ser CELESTE
   - Escanear mismo ticket (ya salió) → debe ser ROJO

3. **Modo Continuo Ingreso y Salida**:

   - Escanear ticket nuevo → debe ser VERDE (ingreso)
   - Escanear mismo ticket → debe ser CELESTE (salida)
   - Escanear de nuevo → debe ser VERDE (ingreso nuevamente)

4. **Modo Preguntar**:
   - Escanear ticket → deben aparecer botones
   - Presionar "Ingresar" → debe validar y mostrar color según estado
   - Presionar "Salir" → debe validar y mostrar color según estado

## Próximos Pasos (Opcional)

- [ ] Agregar animaciones para transiciones de colores
- [ ] Mostrar historial de escaneos en la sesión
- [ ] Agregar contador de ingresos/salidas exitosos
- [ ] Implementar modo offline con sincronización posterior
- [ ] Agregar sonidos diferentes según tipo de resultado
