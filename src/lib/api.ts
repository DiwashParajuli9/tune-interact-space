import { toast } from "sonner";

// Types for Deezer API responses
export interface DeezerArtist {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: string;
}

export interface DeezerTrack {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: DeezerArtist;
  album: DeezerAlbum;
  type: string;
}

export interface DeezerSearchResult {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

export interface DeezerArtistDetails extends DeezerArtist {
  nb_album: number;
  nb_fan: number;
}

export interface DeezerArtistTopTracks {
  data: DeezerTrack[];
  total: number;
}

export interface DeezerPlaylist {
  id: number;
  title: string;
  description: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  md5_image: string;
  picture_type: string;
  creator: {
    id: number;
    name: string;
    tracklist: string;
    type: string;
  };
  type: string;
}

// We'll use a proxy to bypass CORS issues
// Instead of cors-anywhere (which requires demo activation), we'll use another approach
const PROXY_URL = "https://api.allorigins.win/raw?url=";
const BASE_URL = "https://api.deezer.com";

// Sample data for fallback when API has issues
const SAMPLE_TRACKS = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/ab01b96137bd9df9a94e1c608e1004f4/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-0.dzcdn.net/stream/c-0cb3c26f5c0be83042fecb0b925f6816-5.mp3",
    duration: 203,
    artistId: "101",
    albumId: "1001",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/1d4e83b147ce06a7452e91b86d953506/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-4.dzcdn.net/stream/c-4411a1e2b3db5c8d826af7a7966d4018-3.mp3",
    duration: 234,
    artistId: "102",
    albumId: "1002",
  },
  {
    id: "3",
    title: "Someone You Loved",
    artist: "Lewis Capaldi",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/9dac88e7c6a17da0c44c6e7ba435f9c5/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-b.dzcdn.net/stream/c-b7aafae95bd0d9dc4d41f7f6164ebef2-4.mp3",
    duration: 182,
    artistId: "103",
    albumId: "1003",
  },
  {
    id: "4",
    title: "Bad Guy",
    artist: "Billie Eilish",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/f691547698aa8151589c5ca4cc066523/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-2.dzcdn.net/stream/c-2fb3d5fb5f0b6400a11529275dfdc427-6.mp3",
    duration: 194,
    artistId: "104",
    albumId: "1004",
  },
  {
    id: "5",
    title: "Dance Monkey",
    artist: "Tones and I",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/05e11096011ded0561b91746d649ab40/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-a.dzcdn.net/stream/c-a3d2860f9093a4dfc69c73f5245814e2-3.mp3",
    duration: 210,
    artistId: "105",
    albumId: "1005",
  },
  {
    id: "6",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/9b142ff084a95a893f1b6dcec2ab3456/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-0.dzcdn.net/stream/c-0c8199b3d653be9ef6ea4d7f08e3aef2-4.mp3",
    duration: 183,
    artistId: "106",
    albumId: "1006",
  },
  {
    id: "7",
    title: "Memories",
    artist: "Maroon 5",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/edd1708bbd595f5aa7be0bd9a9b7b0af/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-f.dzcdn.net/stream/c-f8f69d54a185d6f9153147f21c493eb0-3.mp3",
    duration: 189,
    artistId: "107",
    albumId: "1007",
  },
  {
    id: "8",
    title: "Circles",
    artist: "Post Malone",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/7c8bd7c778e0fc9649bffc7a87e2ed16/500x500-000000-80-0-0.jpg",
    audioSrc: "https://cdns-preview-a.dzcdn.net/stream/c-a9f39694b3bf9578a5ff4ae156bbc68a-4.mp3",
    duration: 215,
    artistId: "108",
    albumId: "1008",
  }
];

const SAMPLE_ARTISTS = [
  {
    id: "101",
    name: "The Weeknd",
    image: "https://e-cdns-images.dzcdn.net/images/artist/033c9b675d5c42c4695bf9c5acfb4119/500x500-000000-80-0-0.jpg",
    genre: "R&B, Pop",
    bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. He has received numerous accolades, including three Grammy Awards."
  },
  {
    id: "102",
    name: "Ed Sheeran",
    image: "https://e-cdns-images.dzcdn.net/images/artist/0692e35f2801d3d44f05c69b67b83b3d/500x500-000000-80-0-0.jpg",
    genre: "Pop, Folk-Pop",
    bio: "Edward Christopher Sheeran MBE is an English singer, songwriter, musician, record producer, and actor. He has sold more than 150 million records worldwide."
  },
  {
    id: "103",
    name: "Lewis Capaldi",
    image: "https://e-cdns-images.dzcdn.net/images/artist/9402bb64720d3e40023fb7df8909f523/500x500-000000-80-0-0.jpg",
    genre: "Pop, Indie",
    bio: "Lewis Capaldi is a Scottish singer-songwriter. He was nominated for the Critics' Choice Award at the 2019 Brit Awards."
  },
  {
    id: "104",
    name: "Billie Eilish",
    image: "https://e-cdns-images.dzcdn.net/images/artist/8b6e3f73d9a246c8e50e3fde7462fa6a/500x500-000000-80-0-0.jpg",
    genre: "Pop, Electropop",
    bio: "Billie Eilish Pirate Baird O'Connell is an American singer and songwriter. She first gained attention in 2015 when she uploaded the song 'Ocean Eyes' to SoundCloud."
  },
  {
    id: "105",
    name: "Tones and I",
    image: "https://e-cdns-images.dzcdn.net/images/artist/d9f3376d7df32fdc29e17bb28601f114/500x500-000000-80-0-0.jpg",
    genre: "Pop, Indie Pop",
    bio: "Toni Watson, known professionally as Tones and I, is an Australian singer and songwriter. Her breakthrough came with her second single 'Dance Monkey'."
  },
  {
    id: "106",
    name: "Dua Lipa",
    image: "https://e-cdns-images.dzcdn.net/images/artist/e6a04d735093a246dbfd79a530422699/500x500-000000-80-0-0.jpg",
    genre: "Pop, Dance",
    bio: "Dua Lipa is an English singer and songwriter. After working as a model, she signed with Warner Music Group in 2015 and released her self-titled debut album in 2017."
  }
];

// Function to transform Deezer track to our Song format
export const transformTrackToSong = (track: DeezerTrack) => {
  return {
    id: track.id.toString(),
    title: track.title,
    artist: track.artist.name,
    albumCover: track.album.cover_medium,
    audioSrc: track.preview,
    duration: track.duration,
    artistId: track.artist.id.toString(),
    albumId: track.album.id.toString(),
  };
};

// Function to transform Deezer artist to our Artist format
export const transformArtistToArtist = (artist: DeezerArtistDetails) => {
  return {
    id: artist.id.toString(),
    name: artist.name,
    image: artist.picture_medium,
    genre: "Unknown", // Deezer doesn't provide genre in artist object
    bio: `${artist.name} has ${artist.nb_album} albums and ${artist.nb_fan} fans.`,
  };
};

// Helper function to fetch from Deezer API with proxy
const fetchFromDeezer = async (endpoint: string) => {
  try {
    console.log(`Fetching from Deezer: ${endpoint}`);
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(`${BASE_URL}${endpoint}`)}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Deezer (${endpoint}):`, error);
    throw error;
  }
};

// Search for tracks
export const searchTracks = async (query: string) => {
  try {
    const data = await fetchFromDeezer(`/search?q=${encodeURIComponent(query)}`);
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error searching tracks:", error);
    toast.error("Using sample data - Deezer API search failed");
    // Return filtered sample tracks as fallback
    return SAMPLE_TRACKS.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) || 
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Get track details
export const getTrack = async (trackId: string) => {
  try {
    const data = await fetchFromDeezer(`/track/${trackId}`);
    return transformTrackToSong(data);
  } catch (error) {
    console.error("Error getting track:", error);
    toast.error("Failed to get track details");
    // Return a sample track as fallback
    return SAMPLE_TRACKS.find(track => track.id === trackId) || SAMPLE_TRACKS[0];
  }
};

// Get artist details
export const getArtist = async (artistId: string) => {
  try {
    const data = await fetchFromDeezer(`/artist/${artistId}`);
    return transformArtistToArtist(data);
  } catch (error) {
    console.error("Error getting artist:", error);
    toast.error("Failed to get artist details");
    // Return a sample artist as fallback
    return SAMPLE_ARTISTS.find(artist => artist.id === artistId) || SAMPLE_ARTISTS[0];
  }
};

// Get artist top tracks
export const getArtistTopTracks = async (artistId: string) => {
  try {
    const data = await fetchFromDeezer(`/artist/${artistId}/top?limit=10`);
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting artist top tracks:", error);
    toast.error("Failed to get artist's top tracks");
    // Return filtered sample tracks as fallback
    return SAMPLE_TRACKS.filter(track => track.artistId === artistId);
  }
};

// Get chart tracks
export const getChartTracks = async (limit = 30) => {
  try {
    const data = await fetchFromDeezer(`/chart/0/tracks?limit=${limit}`);
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting chart tracks:", error);
    toast.error("Using sample data - Deezer API charts failed");
    // Return sample tracks as fallback
    return SAMPLE_TRACKS.slice(0, limit);
  }
};

// Get recommendations based on a track
export const getRecommendations = async (trackId: string, limit = 10) => {
  try {
    // Deezer doesn't have direct recommendations API, we'll try to get similar tracks
    // If the track exists in our sample data, we can provide other tracks as recommendations
    // Otherwise, we'll use the radio endpoint (not ideal but workable)
    const data = await fetchFromDeezer(`/radio/tracks`);
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    toast.error("Using sample recommendations");
    // Return some sample tracks as fallback
    const excludeTrack = SAMPLE_TRACKS.find(track => track.id === trackId);
    return excludeTrack 
      ? SAMPLE_TRACKS.filter(track => track.id !== trackId).slice(0, limit)
      : SAMPLE_TRACKS.slice(0, limit);
  }
};

// Search for artists
export const searchArtists = async (query: string) => {
  try {
    const data = await fetchFromDeezer(`/search/artist?q=${encodeURIComponent(query)}`);
    return data.data.map((artist: any) => ({
      id: artist.id.toString(),
      name: artist.name,
      image: artist.picture_medium,
      genre: "Unknown",
      bio: `${artist.name} is a popular artist with a large following.`
    }));
  } catch (error) {
    console.error("Error searching artists:", error);
    toast.error("Using sample data - Deezer API search failed");
    // Return filtered sample artists as fallback
    return SAMPLE_ARTISTS.filter(artist => 
      artist.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Get artist albums
export const getArtistAlbums = async (artistId: string, limit = 10) => {
  try {
    const data = await fetchFromDeezer(`/artist/${artistId}/albums?limit=${limit}`);
    return data.data.map((album: any) => ({
      id: album.id.toString(),
      title: album.title,
      cover: album.cover_medium,
      releaseDate: album.release_date,
      trackCount: album.nb_tracks,
      artistId: artistId
    }));
  } catch (error) {
    console.error("Error getting artist albums:", error);
    toast.error("Failed to get artist albums");
    return [];
  }
};

// Get playlist details
export const getPlaylist = async (playlistId: string) => {
  try {
    const data = await fetchFromDeezer(`/playlist/${playlistId}`);
    return {
      id: data.id.toString(),
      name: data.title,
      description: data.description,
      songs: data.tracks.data.map(transformTrackToSong),
      createdAt: new Date(data.creation_date),
      cover: data.picture_medium
    };
  } catch (error) {
    console.error("Error getting playlist:", error);
    toast.error("Failed to get playlist details");
    return null;
  }
};

// Get album tracks
export const getAlbumTracks = async (albumId: string) => {
  try {
    const data = await fetchFromDeezer(`/album/${albumId}/tracks`);
    return data.data.map((track: any) => ({
      id: track.id.toString(),
      title: track.title,
      artist: track.artist.name,
      duration: track.duration,
      preview: track.preview,
      artistId: track.artist.id.toString(),
      albumId: albumId
    }));
  } catch (error) {
    console.error("Error getting album tracks:", error);
    toast.error("Failed to get album tracks");
    return [];
  }
};

// Get genre list
export const getGenres = async () => {
  try {
    const data = await fetchFromDeezer(`/genre`);
    return data.data.map((genre: any) => ({
      id: genre.id.toString(),
      name: genre.name,
      picture: genre.picture_medium
    }));
  } catch (error) {
    console.error("Error getting genres:", error);
    toast.error("Failed to get genres");
    return [
      { id: "1", name: "Pop", picture: "https://e-cdns-images.dzcdn.net/images/misc/db7a604d9e7634a67d45cfc86b7f4866/500x500-000000-80-0-0.jpg" },
      { id: "2", name: "Rock", picture: "https://e-cdns-images.dzcdn.net/images/misc/b36ca681667f48421a733aab7a17fc17/500x500-000000-80-0-0.jpg" },
      { id: "3", name: "Hip Hop", picture: "https://e-cdns-images.dzcdn.net/images/misc/4bcd469d3b555cc9999980325d172ae5/500x500-000000-80-0-0.jpg" },
      { id: "4", name: "Electronic", picture: "https://e-cdns-images.dzcdn.net/images/misc/f3bc07e7a4e03a701c55f386c55e6150/500x500-000000-80-0-0.jpg" }
    ];
  }
};
