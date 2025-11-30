/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      width: {
        27: "27%",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          // primary: "#ff0000", // Eliminar override rojo para usar el morado por defecto/CSS
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
        },
        cupcake: {
          ...require("daisyui/src/theming/themes")["[data-theme=cupcake]"],
          spoty: {},
        },
      },
    ],
  },
};
