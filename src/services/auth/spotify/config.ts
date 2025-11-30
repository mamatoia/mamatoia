const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/";
const clientId = "513f3ea9ee014f1489b01595250fbb81"; // Reemplaza con tu Client ID de Spotify
const redirectUri = "http://localhost:3000/auth/tokens/spotify"; // Cambia a tu URL de redirección

const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
].join(" ");

export { SPOTIFY_AUTH_URL };
export { clientId, redirectUri, scopes };
