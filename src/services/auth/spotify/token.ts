import { SPOTIFY_AUTH_URL, redirectUri, clientId, scopes } from "./config";

export const redirectToSpotify = () => {
  const authUrl = `${SPOTIFY_AUTH_URL}authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return authUrl;
};

export const getAccessTokenFromUrl = (hash: string) => {
  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get("access_token");
  const expiresIn = params.get("expires_in");
  const tokenType = params.get("token_type");

  if (accessToken) {
    return {
      accessToken,
      expiresIn: Number(expiresIn),
      tokenType,
    };
  }

  return null;
};
