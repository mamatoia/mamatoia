<template>
  <input
    ref="wedgeInput"
    type="text"
    autocomplete="off"
    inputmode="none"
    class="sr-only"
    @error="emit('error', $event)"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  prefix: { type: String, default: "" },
  endKey: { type: String, default: "Enter" },
  gapMs: { type: Number, default: 80 },
});

const emit = defineEmits(["code-ready", "error"]);


const wedgeInput = ref(null);
let buf = "";
let lastTs = 0;

function focusWedge() {
  if (document.activeElement !== wedgeInput.value) wedgeInput.value?.focus();
}

function handleError(error) {
  console.error("PaseshowWebViewScanner Error:", error);
  emit("error", error);
}

function handleKeydown(e) {
  const now = performance.now();
  if (now - lastTs > props.gapMs) buf = "";
  lastTs = now;
  if (e.key === props.endKey) {
    const raw = buf;
    buf = "";
    const code =
      props.prefix && raw.startsWith(props.prefix)
        ? raw.slice(props.prefix.length)
        : raw;
    const cleaned = (code ?? "").toString().trim();
    if (cleaned) emit("code-ready", cleaned);
    e.preventDefault();
    return;
  }
  if (e.key.length === 1) buf += e.key;
}

function onVisibility() {
  if (!document.hidden) setTimeout(focusWedge, 0);
}

onMounted(() => {
  focusWedge();
  window.addEventListener("focus", () => setTimeout(focusWedge, 0));
  document.addEventListener("visibilitychange", onVisibility);
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVisibility);
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped></style>
