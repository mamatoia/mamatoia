import { defineStore } from 'pinia';
import { useArtistStore } from './artist';

export const useMusicStore = defineStore('music', {
  state: () => ({
    currentSong: null as { title: string; artist: string } | null,
  }),
  actions: {
    playSong(song: { title: string; artist: string }) {
      this.currentSong = song;
    },
    stopSong() {
      this.currentSong = null;
    },
  },
});

export { useArtistStore };