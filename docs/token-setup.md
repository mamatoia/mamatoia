# 🔑 Configuración de Tokens de Acceso

## 🎯 Estado Actual

El sistema está funcionando correctamente. El error **401 Unauthorized** es esperado porque estamos en **modo desarrollo** con un token de prueba.

## ✅ Lo que funciona:

- ✅ Botones de INGRESAR/SALIR/REINGRESAR
- ✅ Flujo de estados correcto (N → E → S → E)
- ✅ Llamadas a la API configuradas
- ✅ Manejo de errores implementado
- ✅ Modo demo funcional

## 🔧 Para usar en producción:

### 1. Configurar token real:

```typescript
// src/config/access.ts
export const ACCESS_CONFIG = {
  tokens: {
    development: "demo-token",
    production: "TU_TOKEN_REAL_AQUI", // ← Cambiar este
    staging: "TU_TOKEN_STAGING_AQUI",
  },
};
```

### 2. O configurar dinámicamente:

```typescript
// En cualquier componente o página
import { useAccessStore } from "~/src/stores/paseshow/access";

const accessStore = useAccessStore();
accessStore.setToken("tu-token-real-obtenido-del-login");
```

### 3. Configurar URL de producción:

```typescript
// src/config/access.ts
export const ACCESS_CONFIG = {
  apiUrls: {
    production: "https://tu-api-real.com", // ← Cambiar este
  },
};
```

## 🧪 Modo Demo

Mientras tanto, el sistema funciona en **modo demo**:

- ✅ Los botones funcionan
- ✅ Los estados cambian correctamente
- ✅ Muestra mensajes "MODO DEMO"
- ⏱️ Simula delay de 1 segundo
- 🔵 Mensajes en azul para indicar demo

## 🚀 Para testing:

```bash
# Modo desarrollo (demo)
npm run dev

# Modo producción (requiere token real)
npm run build
npm run start
```

## 🔍 Debug

Para verificar configuración actual:

```javascript
import { getCurrentConfig, isDemoMode } from "~/src/config/access";

console.log("Config:", getCurrentConfig());
console.log("Demo mode:", isDemoMode());
```

## 🎯 Próximos pasos:

1. ✅ **Sistema funcionando** - Botones y flujo completo
2. 🔧 **Configurar token real** cuando esté disponible
3. 🧪 **Testear en producción** con API real
4. 📊 **Agregar logs** para monitoreo
