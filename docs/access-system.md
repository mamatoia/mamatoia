# 🎫 Sistema de Registro de Accesos

## 📋 Descripción

Sistema para registrar entradas y salidas de personas en eventos, basado en la lógica de la aplicación Android existente. Permite a los operadores registrar cuando una persona entra o sale del evento mediante botones en las tarjetas de tickets.

## 🏗️ Arquitectura

### 📁 Archivos principales:

- **`src/services/paseshow/access.ts`** - Servicio para llamadas API de registro
- **`src/stores/paseshow/access.ts`** - Store para configuración y estado global
- **`src/composables/useAccessConfig.ts`** - Composable para inicialización
- **`paseshow/components/cards/TicketCard.vue`** - Componente con botones de acceso

## 🎯 Funcionalidades

### ✅ Estados de Ticket (Estado físico real):

- **N** (Nuevo) → Solo **INGRESAR** (nunca ingresó físicamente)
- **E** (Adentro) → Solo **SALIR** (está físicamente adentro)
- **S** (Afuera) → Solo **REINGRESAR** (salió físicamente, puede reingresar)

**⚠️ IMPORTANTE**: El estado inicial siempre es **N**, independientemente de lo que diga la base de datos. Solo cambia cuando el operador presiona los botones físicamente.

### 🎨 Lógica de Colores:

- **🟢 Verde**: Entrada válida sin descuentos (Mayores)
- **🟡 Amarillo**: Entrada con descuentos (porcentaje != 0)
- **🔴 Rojo**: Entrada no válida para el sector actual

### ⚙️ Tipos de Escaneo:

- **`preguntar`**: Muestra ambos botones **INGRESAR/REINGRESAR** + **SALIR**
- **`continuo ingreso`**: Solo muestra botón **INGRESAR/REINGRESAR**
- **`continuo salida`**: Solo muestra botón **SALIR**
- **`continuo ingreso y salida`**: Muestra ambos botones

## 🚀 Uso

### 1. Inicialización en página:

```vue
<script setup>
import { useAccessConfig } from "~/src/composables/useAccessConfig";

const { initializeAccess } = useAccessConfig();

onMounted(() => {
  initializeAccess(); // Configura sectores activos y tokens
});
</script>
```

### 2. Botones en TicketCard:

```vue
<TicketCard :data="ticketData" type="dynamic" :show-access-buttons="true" />
```

### 3. Configurar store:

```javascript
import { useAccessStore } from "~/src/stores/paseshow/access";

const accessStore = useAccessStore();

// Configurar token de API
accessStore.setToken("your-api-token");

// Configurar sectores activos
accessStore.addActiveSector("123");

// Configurar tipo de escaneo
accessStore.setScanType("preguntar");
```

## 🔌 API

### Endpoint: `PUT /ubicacioneventoes/`

**Request:**

```json
{
  "Id": 12345,
  "dni": "12345678",
  "estado": "N",
  "ingreso": "E",
  "idSector": "456",
  "fecha": "07/10/25",
  "hora": "14:30"
}
```

**Response:** `200 OK` (sin body) o error HTTP

## 🎭 Estados Visuales

```
┌─────────────────────────────────────┐
│  👤 Juan Pérez - DNI: 12345678      │
│  🎫 Sector: Platea Alta             │
│  ┌─────────────┐                    │
│  │  INGRESAR   │                    │ ← Estado inicial siempre
│  └─────────────┘                    │
│  ✅ INGRESO REGISTRADO CORRECTAMENTE │ ← Feedback dinámico
└─────────────────────────────────────┘

Flujo FÍSICO correcto por persona:
👤 Consulta DNI: [🟢 INGRESAR]          (Estado inicial N)
                ↓ click INGRESAR (registro físico)
👤 Está adentro: [🔴 SALIR]             (Estado E)
                ↓ click SALIR (registro físico)
👤 Salió:        [🔵 REINGRESAR]        (Estado S)
                ↓ click REINGRESAR (registro físico)
👤 Está adentro: [🔴 SALIR]             (Estado E)
```

## 🛠️ Próximas mejoras

- [ ] Modo offline con sincronización
- [ ] Historial de movimientos por ticket
- [ ] Integración con escáner QR/Código de barras
- [ ] Reportes de entradas/salidas por sector
- [ ] Notificaciones push para eventos importantes

## 🐛 Debug

Para ver los logs de configuración:

```javascript
console.log("🎯 Access Store:", useAccessStore().$state);
```
