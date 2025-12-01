<template>
  <div>
    <!-- Left fixed icons -->
    <div class="absolute left-4 top-4 z-50 flex flex-col gap-2">
      <IconButton
        @click="$emit('toggle-torch')"
        :icon="torchOn ? 'solid:bolt' : 'solid:bolt-slash'"
      />
      <IconButton
        @click="$emit('toggle-beep')"
        :icon="beepOn ? 'solid:bell-alert' : 'outline:bell-slash'"
      />
    </div>
    <!-- Right fixed icons -->
    <div class="absolute right-4 top-4 z-50 flex flex-col gap-2">
      <IconButton
        @click="$emit('toggle-camera-size')"
        :icon="
          cameraSize === 2
            ? 'outline:arrows-pointing-out'
            : 'outline:arrows-pointing-in'
        "
      />
    </div>
  </div>
</template>

<script setup>
import IconButton from "../ui/buttons/IconButton.vue";

defineProps({
  torchOn: { type: Boolean, default: false },
  beepOn: { type: Boolean, default: true },
  vibrateOn: { type: Boolean, default: true },
  cameraSize: { type: Number, default: 0 },
});

defineEmits([
  "toggle-torch",
  "toggle-beep",
  "toggle-vibrate",
  "toggle-camera-size",
]);
</script>

<style scoped></style>
