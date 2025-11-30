<template>
  <div class="dropdown dropdown-end">
    <button tabindex="0" class="btn btn-md btn-ghost">
      {{ label }}
    </button>
    <ul
      tabindex="0"
      class="dropdown-content menu app-menu bg-base-100 rounded-xs z-10 shadow"
    >
      <li v-for="action in actions" :key="action.key">
        <button type="button" @click="(e) => handleClick(action.key, e)">
          {{ action.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "Acciones",
  },
  actions: {
    type: Array,
    required: true,
    // [{ key: 'sync', label: 'Sincronizar' }, ...]
  },
});

const emit = defineEmits(["action"]);

const handleClick = (actionKey, event) => {
  const el = event?.currentTarget || event?.target || document.activeElement;
  emit("action", actionKey, el);

  // Cerrar el dropdown después del click
  const dropdown = document.activeElement;
  if (dropdown) {
    dropdown.blur();
  }
};
</script>
