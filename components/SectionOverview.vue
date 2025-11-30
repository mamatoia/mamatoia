<template>
  <div class="flex justify-center items-center pt-3 pb-3 p-0 bg-base-200">
    <div>
      <div
        class="text-base-content text-2xl font-bold p-4 rounded-t-lg bg-base-100"
      >
        {{ title }}
      </div>
      <!-- Listado centrado -->
      <ul class="space-y-4 bg-base-100 rounded-b-lg w-3xl">
        <li v-for="(item, index) in items" :key="index">
          <NuxtLink
            :to="item?.link"
            class="flex items-center px-4 py-2 text-base-content rounded-md hover:bg-primary transition"
          >
            <div class="flex items-center space-x-2">
              <button class="btn btn-square btn-ghost bg-base-200">
                <ui-icon :name="item?.icon" class="w-5 h-5" />
              </button>
              <span>{{ item?.text }}</span>
            </div>
            <ui-icon name="outline:chevron-right" class="w-5 h-5 ml-auto" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: "Dirección de correo electrónico o nombre de usuario",
  },
  items: {
    type: Array<Object>,
    required: true,
  },
});
</script>
