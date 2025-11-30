# widgets

Cada widget es un componente autocontenible, con su propio store y lógica.

- Si el widget necesita datos, los obtiene a través de su store.
- Si necesita interactuar con otros widgets o stores, lo hace mediante eventos o enlazando stores padres.
- Los widgets deben ser lo más agnósticos posible y reutilizables.

Ejemplo de estructura:

```
widgets/
  SongWidget/
    SongWidget.vue
    songStore.ts
```
