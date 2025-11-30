# ScannerPanel refactor

Este directorio contiene el ScannerPanel desglosado siguiendo principios SOLID.

Componentes:

- `index.vue`: Orquestador. Mantiene estado de tamaño de cámara, mensaje de escaneo y coordina acciones.
- `CameraView.vue`: Renderiza el `<video>` y la máscara de ventana de escaneo. Expone `videoEl` al padre.
- `ControlPanel.vue`: Botonera fija (linterna, beep, vibración, tamaño de cámara). Emite eventos de toggle.
	- Nota: en la última refactorización `ControlPanel` se suele renderizar dentro de `CameraView` a través
		de su `overlay` slot para que los iconos pertenezcan visualmente a la cámara (se posicionan con `absolute`
		dentro del contenedor de la cámara en lugar de `fixed` sobre el viewport).
- `ScanMessage.vue`: Overlay con el mensaje y botón para limpiar.
- `WedgeInput.vue`: Captura entradas de lector tipo teclado (wedge) y emite códigos reconstruidos.

Composables:

- `useCamera.js`: Abstrae ZXing, start/stop, torch. API: `bindVideo(el)`, `start()`, `stop()`, `toggle()`, `setTorch(on)`, `isRunning`, `status`.
- `useFeedback.js`: Maneja beep y vibración. API: `beepOn`, `vibrateOn`, `toggleBeep()`, `toggleVibrate()`, `playBeep()`, `doVibrate()`.
- `useScanDeduper.js`: Evita procesar duplicados en una ventana temporal. API: `shouldProcess(code)`, `clear(code)`, `destroy()`.
	- Nota: `useScanDeduper` ahora inicia su limpieza periódica sólo en cliente (usa `onMounted`) para evitar
		que `setInterval` se ejecute durante SSR.

- `useCamera.js`: Ahora soporta decodificar sólo una región de interés (ROI) del frame para respetar la
	máscara visual. Se le puede pasar un `getRoiFactor()` para controlar el ancho relativo del recorte
	(p.ej. 1.0, 0.72, 0.4) y mejorar precisión/rendimiento en dispositivos lentos.

Servicios:

- `services/scanService.js`: Encapsula `consultaQR` (Pinia store existente) y `registrarAcceso` (stub).

Notas:

- El flujo y la API pública del componente principal se mantienen.
- La linterna depende de soporte del dispositivo y navegador.
- Para lectores por teclado, `WedgeInput` mantiene el foco y escucha eventos globales.
 - Para lectores por teclado, `WedgeInput` mantiene el foco y escucha eventos globales.

Cambio rápido de comportamiento:
- `cameraSize` ahora es propiedad de `CameraView` (persistida en `localStorage`) y `index.vue` mantiene
	un `uiCameraSize` espejo para controlar el icono del `ControlPanel` y para pasar el factor ROI a `useCamera`.
