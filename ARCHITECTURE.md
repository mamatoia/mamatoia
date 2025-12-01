# Arquitectura y Pautas del Proyecto

Este proyecto sigue principios SOLID y una arquitectura orientada a dominio, con las siguientes pautas clave:

## Estructura General

- **domains/**: Aquí se implementa el proyecto por ejemplo: `domains/web`. y aquí se creará todo el contenido del proyecto que servirá a pages desde la carpeta views por ej: `domains/web/vews`
  reviar como implementar en domains/README.md

## Tailwind y DaisyUI

- Todo el diseño se realiza con clases de Tailwind en el atributo `class=""`.
- No se usan hojas de estilos externas ni internas.
- Los componentes deben ser compatibles con el sistema de themes de DaisyUI. Usa las clases de DaisyUI y los tokens de color para asegurar compatibilidad entre dark/light y otros themes.

## Stores y Servicios

- Los stores son la única forma de conectar componentes/widgets con servicios externos.
- Los widgets agnósticos deben comunicarse mediante eventos o stores conectables.
- No se usan composables. Toda la lógica va dentro del componente o el store.
- El widget es un componente que tiene la posibilidad ya de funcionar con la hidratación de datos

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
    views/
    HomeView.vue (usa panels)
    ...
```

---

> Mantén esta arquitectura y consulta si tienes dudas antes de romper alguna pauta.
