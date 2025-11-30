import { link } from "fs";
import { defineStore } from "pinia";
import createLastfmService from "~/src/services/lastfm";

export const useArtistStore = defineStore("artist", {
  state: () => ({
    artists: [
      {
        nombre: "Lara Campos",
        cancion: "René",
        imagen: "/images/imagen-laracampos.jpg",
        codigo: "laracampos",
        canciones: ["René", "La Mujer Perfecta", "La Difícil", "La Fama"],
      },
      {
        nombre: "Shakira",
        cancion: "Soltera",
        imagen: "/images/imagen-shakira.jpg",
        codigo: "shakira",
        canciones: ["Soltera", "Donde Estás Corazón", "Antología", "Ojos Así"],
      },
      {
        nombre: "Radiohead",
        cancion: "Creep",
        imagen: "/images/imagen-radiohead.jpg",
        codigo: "radiohead",
        canciones: [
          "Creep",
          "Karma Police",
          "No Surprises",
          "Paranoid Android",
        ],
      },
      {
        nombre: "The Beatles",
        cancion: "Hey Jude",
        imagen: "/images/imagen-thebeatles.jpg",
        codigo: "thebeatles",
        canciones: ["Hey Jude", "Let It Be", "Yesterday", "Come Together"],
      },
      {
        nombre: "U2",
        cancion: "With Or Without You",
        imagen: "/images/imagen-u2.jpg",
        codigo: "u2",
        canciones: [
          "With Or Without You",
          "One",
          "Sunday Bloody Sunday",
          "Beautiful Day",
        ],
      },
      {
        nombre: "The Rolling Stones",
        cancion: "Paint It Black",
        imagen: "/images/imagen-therollingstones.jpg",
        codigo: "therollingstones",
        canciones: [
          "Paint It Black",
          "Sympathy For The Devil",
          "Gimme Shelter",
          "Angie",
        ],
      },
      {
        nombre: "The Clash",
        cancion: "Should I Stay Or Should I Go",
        imagen: "/images/imagen-theclash.jpg",

        codigo: "theclash",
        canciones: [
          "Should I Stay Or Should I Go",
          "London Calling",
          "Rock The Casbah",
          "Train In Vain",
        ],
      },
      {
        nombre: "The Doors",
        cancion: "Light My Fire",
        imagen: "/images/imagen-thedoors.jpg",
        codigo: "thedoors",
        canciones: [
          "Light My Fire",
          "Riders On The Storm",
          "Break On Through",
          "People Are Strange",
        ],
      },
      {
        nombre: "The Police",
        cancion: "Every Breath You Take",
        imagen: "/images/imagen-thepolice.jpg",
        codigo: "thepolice",
        canciones: [
          "Every Breath You Take",
          "Roxanne",
          "Message In A Bottle",
          "Don't Stand So Close To Me",
        ],
      },
    ],
    favoritos: [2, 3, 5],
    bloqueados: [],
    lyrics: [
      {
        codigo: "laracampos",
        letra: "René",
        texto: `René, tú eres un artista
            Tu vida es una obra de arte
            No importa lo que digan
            No importa lo que hagan contigo
            Tú eres un artista
            Tu vida es una obra de arte
            No importa lo que digan
            No importa lo que hagan contigo
            Tú eres un artista
            Tu vida es una obra de arte
            No importa lo que digan
            No importa lo que hagan contigo
            Tú eres un artista
            Tu vida es una obra de arte
            No importa lo que digan
            No importa lo que hagan contigo
            Tú eres un artista
            Tu vida es una obra de arte
            No importa lo que digan
            No importa lo que hagan contigo
            Tú eres un artista`,
      },
      {
        codigo: "shakira",
        letra: "Soltera",
        texto: `Soltera, soltera, soltera
            Soltera, soltera, soltera
            Soltera, soltera, soltera
            Soltera, soltera, soltera`,
      },
    ],
    listas: [],
  }),
  actions: {
    async fetchTopArtists() {
      const lastfmService = createLastfmService();
      this.artists = await lastfmService.getTopArtists();
    },
    addFavorite(index: number) {
      this.favoritos.push(index);
    },
    removeFavorite(index: number) {
      this.favoritos = this.favoritos.filter((i) => i !== index);
    },
    agregarLista(nombre: string) {
      if (!nombre) return;
      this.listas.push({
        nombre,
        canciones: [],
      });
    },
    agregarCancionALista(
      nombreLista: string,
      cancion: { cancion: string; artista: string }
    ) {
      const lista = this.listas.find((lista) => lista.nombre === nombreLista);
      if (lista) {
        lista.canciones.push(cancion);
      } else {
        console.error(`La lista "${nombreLista}" no existe.`);
      }
    },
    eliminarCancionDeLista(
      nombreLista: string,
      cancion: { cancion: string; artista: string }
    ) {
      const lista = this.listas.find((lista) => lista.nombre === nombreLista);
      if (lista) {
        lista.canciones = lista.canciones.filter(
          (item) =>
            item.cancion !== cancion.cancion || item.artista !== cancion.artista
        );
      } else {
        console.error(`La lista "${nombreLista}" no existe.`);
      }
    },
    actualizarLista(nombre: string, canciones: Array<any>) {
      const lista = this.listas.find((lista) => lista.nombre === nombre);
      if (lista) {
        lista.canciones = canciones;
      }
    },
    actualizarNombreLista(nombreAnterior: string, nuevoNombre: string) {
      const lista = this.listas.find(
        (lista) => lista.nombre === nombreAnterior
      );
      if (lista) {
        lista.nombre = nuevoNombre;
      } else {
        console.error(`La lista "${nombreAnterior}" no existe.`);
      }
    },
  },

  getters: {
    listadoDeArtistas: (state) => () => {
      return state.artists;
    },
    imagenesConEnlaces: (state) => () => {
      return state.artists.map((artist) => ({
        src: artist.imagen,
        link: `/artista/${artist.codigo}`,
      }));
    },
    getArtistByCode: (state) => (code: string) => {
      return state.artists.find((artist) => artist.codigo === code);
    },
    sortedArtists: (state) => (order: string) => {
      return [...state.artists].sort((a, b) => {
        if (order === "asc") {
          return a.nombre.localeCompare(b.nombre);
        } else {
          return b.nombre.localeCompare(a.nombre);
        }
      });
    },
    artistasConDetalles: (state) => () => {
      return state.artists.map((artist) => ({
        nombre: artist.nombre,
        image: artist.imagen,
        link: `/artista/${artist.codigo}`,
      }));
    },
    filtrarArtistasPorNombre: (state) => (query: string) => {
      if (!query) return [];

      const songs = state.artists.flatMap((artista) =>
        artista.canciones.map((cancion) => ({
          cancion,
          artista,
        }))
      );

      const artist = songs.filter(
        (item) =>
          item.artista.nombre.toLowerCase().includes(query.toLowerCase()) ||
          item.cancion.toLowerCase().includes(query.toLowerCase())
      );

      return artist.map((item) => ({
        label: item.artista.nombre,
        value: {
          nombre: item.artista.nombre,
          cancion: item.cancion,
          imagen: item.artista.imagen,
          codigo: item.artista.codigo,
        },
      }));
    },
    obtenerListas: (state) => {
      return state.listas;
    },
  },
});
