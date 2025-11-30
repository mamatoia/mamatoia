export default function () {
  const LASTFM_API_KEY = "8d66656c24b99ca3306835d85bd92b44";
  const LASTFM_API_SECRET = "4e6825539e070b6cbcbdad1d0a7b8b28";

  const API_KEY = LASTFM_API_KEY;

  const getTopArtists = async () => {
    try {
      const { data } = await useFetch("https://ws.audioscrobbler.com/2.0", {
        params: {
          method: "artist.search",
          artist: "cher",
          api_key: API_KEY,
          format: "json",
        },
      });

      if (!data.value) {
        return [];
      }

      const artista = data.value.results.artistmatches.artist.map(
        (artist: any) => {
          return {
            nombre: artist.name,
            imagen: artist.image[0]["#text"],
            codigo: artist.name.toLowerCase().replace(/\s/g, ""),
            cancion: "Canción de " + artist.name,
          };
        }
      );

      return artista;
    } catch (error) {
      console.error("Error fetching top artists:", error);
      return [];
    }
  };

  return {
    getTopArtists,
  };
}
