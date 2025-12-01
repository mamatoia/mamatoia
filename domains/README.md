# domains

Aqui se debe crear una carpeta que corresponde al dominio

Ejemplo:

```
domains/mamatoia/

```

y esta carpeta contiene la base funcional del proyecto organizado en las siguientes carpetas

```
views
panels
widgets
components
stores
services
```

Esto ayuda a mantener el proyecto escalable y organizado por contexto de negocio.

- **views/**: Se arma con panels. Cada view representa una pantalla o sección principal.
- **panels/**: Un panel es una sección de una view. Puede cargar componentes o widgets.
- **widgets/**: Cada widget es un componente autocontenible, con su propio store. Si necesita interactuar con otros widgets o stores, lo hace mediante eventos o enlazando stores padres.
- **components/ui/**: Contiene componentes atómicos, organizados por categoría. Todos los componentes son de responsabilidad única.
