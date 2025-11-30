import { onMounted, onBeforeUnmount } from "vue";

export function useScanDeduper(windowMs = 5000) {
  const recentScans = {};
  let intervalId = null;

  function tick() {
    const cutoff = Date.now() - windowMs;
    for (const k in recentScans) {
      if (recentScans[k] < cutoff) delete recentScans[k];
    }
  }

  function start() {
    if (typeof window === "undefined") return; // SSR guard
    if (!intervalId) intervalId = setInterval(tick, windowMs);
  }

  function stop() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  function shouldProcess(code) {
    try {
      const now = Date.now();
      const key = code == null ? "" : String(code).trim().toLowerCase();
      if (!key) return true;
      if (recentScans[key] && now - recentScans[key] < windowMs) {
        return false;
      }
      recentScans[key] = now;
    } catch (e) {
      // if anything goes wrong, be permissive
      return true;
    }
    return true;
  }

  function clear(code) {
    try {
      const key = code == null ? "" : String(code).trim().toLowerCase();
      if (key && recentScans[key]) delete recentScans[key];
    } catch (e) {
      /* ignore */
    }
  }

  function destroy() {
    stop();
  }

  onMounted(start);
  onBeforeUnmount(stop);

  return { shouldProcess, clear, destroy, start, stop };
}
