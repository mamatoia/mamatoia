export const fetchSpotifyUser = async (accessToken: string) => {
  try {
    const user = await $fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching Spotify user:", error);
    return null;
  }
};
