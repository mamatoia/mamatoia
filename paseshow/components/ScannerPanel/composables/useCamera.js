import { ref } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useCamera(options = {}) {
  const { onScan, getRoiFactor } = options;

  const isRunning = ref(false);
  const status = ref("Cámara lista");

  let reader = null;
  let currentStream = null;
  let currentTrack = null;
  let videoEl = null;
  let timer = null;
  let canvas = null;
  let ctx = null;
  // Pause decoding while processing to prevent continuous scans (one-shot mode)
  let _isProcessing = false;
  let _lastDecodedText = null;
  let _lastDecodedAt = 0;
  const _DECODE_COOLDOWN_MS = 2000; // 2s cooldown to prevent rapid re-scans

  function bindVideo(el) {
    videoEl = el;
  }

  function getFactor() {
    try {
      const f = typeof getRoiFactor === "function" ? getRoiFactor() : 1;
      if (typeof f !== "number" || !isFinite(f)) return 1;
      return Math.min(1, Math.max(0.2, f));
    } catch {
      return 1;
    }
  }

  async function start() {
    try {
      await stop();
      // Reset processing state when camera starts
      _isProcessing = false;
      _lastDecodedText = null;
      _lastDecodedAt = 0;
      reader = new BrowserMultiFormatReader();
      const constraints = { video: { facingMode: { ideal: "environment" } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!videoEl) throw new Error("Video element not bound");
      videoEl.srcObject = stream;
      await videoEl.play();

      currentStream = stream;
      const tracks = stream.getVideoTracks();
      currentTrack = tracks && tracks.length ? tracks[0] : null;

      if (!canvas) {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d", { willReadFrequently: true });
      }

      isRunning.value = true;
      status.value = "Cámara encendida";

      // decode loop every ~400ms (less frequent = less CPU, fewer duplicate detections)
      timer = setInterval(async () => {
        if (!isRunning.value || !videoEl || _isProcessing) return;
        const vw = videoEl.videoWidth || 0;
        const vh = videoEl.videoHeight || 0;
        if (!vw || !vh) return;

        const factor = getFactor();
        const sw = Math.floor(vw * factor);
        const sh = vh;
        const sx = Math.floor((vw - sw) / 2);
        const sy = 0;
        if (!sw || !sh) return;

        if (canvas.width !== sw || canvas.height !== sh) {
          canvas.width = sw;
          canvas.height = sh;
        }
        ctx.drawImage(videoEl, sx, sy, sw, sh, 0, 0, sw, sh);
        try {
          const result = await reader.decodeFromCanvas(canvas);
          if (result && onScan) {
            try {
              const txt = String(result.getText() || "").trim();
              const key = txt.toLowerCase();
              const now = Date.now();
              if (
                key &&
                _lastDecodedText === key &&
                now - _lastDecodedAt < _DECODE_COOLDOWN_MS
              ) {
                // skip duplicate decode within cooldown window
              } else {
                _lastDecodedText = key;
                _lastDecodedAt = now;
                // Pause decoding while onScan processes
                _isProcessing = true;
                console.log(
                  "PaseshowWebViewCamera Decode paused, calling onScan for:",
                  key
                );
                onScan(txt);
                // Resume decoding after cooldown
                setTimeout(() => {
                  _isProcessing = false;
                  console.log("PaseshowWebViewCamera Decode resumed after cooldown");
                }, _DECODE_COOLDOWN_MS);
              }
            } catch (e) {
              // if any error in guard, still try to call onScan
              try {
                _isProcessing = true;
                onScan(String(result.getText() || "").trim());
                setTimeout(() => {
                  _isProcessing = false;
                }, _DECODE_COOLDOWN_MS);
              } catch (_) {
                _isProcessing = false;
              }
            }
          }
        } catch (e) {
          // NotFoundException or decode error; clear last decoded so new QR is detected faster
          _lastDecodedText = null;
        }
      }, 400);
    } catch (e) {
      status.value =
        "No se pudo iniciar la cámara. Verifica permisos, HTTPS/localhost y que no esté en uso por otra pestaña.";
    }
  }

  async function stop() {
    try {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
      currentStream = null;
      currentTrack = null;
      // Reset state when camera stops
      _isProcessing = false;
      _lastDecodedText = null;
    } catch {}
    isRunning.value = false;
    status.value = "Cámara detenida";
  }

  async function toggle() {
    if (isRunning.value) return stop();
    return start();
  }

  async function setTorch(on) {
    if (currentTrack && typeof currentTrack.applyConstraints === "function") {
      try {
        await currentTrack.applyConstraints({ advanced: [{ torch: !!on }] });
        return true;
      } catch (e) {
        status.value = "Linterna no soportada en este dispositivo";
        return false;
      }
    }
    status.value = "Linterna no soportada en este dispositivo";
    return false;
  }

  function getTrack() {
    return currentTrack;
  }

  function resetProcessing() {
    _isProcessing = false;
    _lastDecodedText = null;
    _lastDecodedAt = 0;
    console.log("PaseshowWebViewCamera Processing state reset manually");
  }

  return {
    isRunning,
    status,
    bindVideo,
    start,
    stop,
    toggle,
    setTorch,
    getTrack,
    resetProcessing,
  };
}
