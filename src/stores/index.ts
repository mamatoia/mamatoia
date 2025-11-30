import { createPinia } from 'pinia';
import { useAuthStore } from './auth';
import { useMusicStore, useArtistStore } from './music';

const pinia = createPinia();

export { pinia, useAuthStore, useMusicStore, useArtistStore };