interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
}

export const convertSpotifyTrack = async (spotifyTrack: SpotifyTrack) => {
  const searchQuery = `${spotifyTrack.name} ${spotifyTrack.artists[0].name}`;
  const response = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(searchQuery)}&filter=music`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    return {
      title: spotifyTrack.name,
      artist: spotifyTrack.artists[0].name,
      thumbnail: spotifyTrack.album.images[0]?.url,
      videoId: data.items[0].id
    };
  }
  throw new Error('No matching track found');
};