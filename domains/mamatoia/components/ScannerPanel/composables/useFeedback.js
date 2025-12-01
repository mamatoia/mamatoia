import { ref } from "vue";

export function useFeedback() {
  const beepOn = ref(true);
  const vibrateOn = ref(true);

  let _lastPlayAt = 0;

  function toggleBeep() {
    beepOn.value = !beepOn.value;
  }

  function toggleVibrate() {
    vibrateOn.value = !vibrateOn.value;
  }

  function playBeep() {
    try {
      const now = Date.now();
      if (now - _lastPlayAt < 160) return; // 160ms guard
      _lastPlayAt = now;
    } catch (e) {
      /* ignore */
    }

    function tryOscillator() {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        // resume if suspended (some browsers start suspended until gesture)
        if (ctx.state === "suspended" && typeof ctx.resume === "function") {
          ctx.resume().catch(() => {});
        }
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 1000;
        g.gain.value = 0.12; // modest volume
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => {
          try {
            o.stop();
            o.disconnect();
            g.disconnect();
            if (typeof ctx.close === "function") ctx.close().catch(() => {});
          } catch (e) {
            /* ignore */
          }
        }, 140);
      } catch (e) {
        console.warn("playBeep oscillator failed", e);
      }
    }

    try {
      const audio = new Audio("/beep-07a.wav");
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === "function") {
        p.catch((err) => {
          console.warn(
            "playBeep: audio play failed, falling back to oscillator",
            err
          );
          tryOscillator();
        });
      }
    } catch (e) {
      console.warn("playBeep error, falling back to oscillator:", e);
      tryOscillator();
    }
  }

  function doVibrate() {
    if (navigator.vibrate) {
      try {
        navigator.vibrate([80, 40, 80]);
      } catch (e) {
        console.warn("doVibrate error", e);
      }
    }
  }

  return { beepOn, vibrateOn, toggleBeep, toggleVibrate, playBeep, doVibrate };
}
