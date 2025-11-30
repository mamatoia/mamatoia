# Arquitectura y Pautas del Proyecto

Este proyecto sigue principios SOLID y una arquitectura orientada a dominio, con las siguientes pautas clave:

## Estructura General

- **pages/**: Solo carga vistas (views). No contiene lógica ni componentes directos.
- **views/**: Se arma con panels. Cada view representa una pantalla o sección principal.
- **panels/**: Un panel es una sección de una view. Puede cargar componentes o widgets.
- **widgets/**: Cada widget es un componente autocontenible, con su propio store. Si necesita interactuar con otros widgets o stores, lo hace mediante eventos o enlazando stores padres.
- **components/ui/**: Contiene componentes atómicos, organizados por categoría. Todos los componentes son de responsabilidad única.
- **domains/**: (Opcional) Aquí puedes organizar lógica y stores por dominio de negocio, por ejemplo `domains/web`.

## Tailwind y DaisyUI

- Todo el diseño se realiza con clases de Tailwind en el atributo `class=""`.
- No se usan hojas de estilos externas ni internas.
- Los componentes deben ser compatibles con el sistema de themes de DaisyUI. Usa las clases de DaisyUI y los tokens de color para asegurar compatibilidad entre dark/light y otros themes.

## Stores y Servicios

- Los stores son la única forma de conectar componentes/widgets con servicios externos.
- Los widgets agnósticos deben comunicarse mediante eventos o stores conectables.
- No se usan composables. Toda la lógica va dentro del componente o el store.

## Responsabilidad Única

- Cada archivo, componente, panel, view o widget debe tener una única responsabilidad.

## Para la IA

- Si alguna pauta no encaja o puede mejorarse, pregunta de forma clara al usuario antes de continuar.
- Si tienes dudas sobre la ubicación o responsabilidad de un archivo, consulta en el chat.

---

## Ejemplo de Estructura

```
pages/
  index.vue (solo importa la view)
views/
  HomeView.vue (usa panels)
panels/
  HomePanel.vue (usa widgets o componentes)
widgets/
  SongWidget/
    SongWidget.vue
    songStore.ts
components/
  ui/
    buttons/
      PrimaryButton.vue
    lists/
      SimpleList.vue
domains/
  web/
    ...
```

---

> Mantén esta arquitectura y consulta si tienes dudas antes de romper alguna pauta.
