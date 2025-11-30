<template>
  <div
    class="flex flex-col items-center justify-center p-4 rounded shadow bg-base-100"
  >
    <div
      class="w-20 h-20 flex items-center justify-center mb-2 bg-white rounded-full"
    >
      <img
        :src="avatar"
        alt="avatar"
        class="w-full h-full object-cover rounded-full"
      />
    </div>
    <div class="font-semibold text-sm text-base-content text-center">
      {{ label }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  avatar: {
    type: String,
    default: "https://api.dicebear.com/9.x/big-ears/svg?seed=Adrian",
  },
});
</script>
