
import { toast } from "sonner";

// Types for Spotify API responses
export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  total_tracks: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  preview_url: string;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

export interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    next: string | null;
  };
}

export interface SpotifyArtistTopTracks {
  tracks: SpotifyTrack[];
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  tracks: {
    total: number;
    items: Array<{
      track: SpotifyTrack;
    }>;
  };
  owner: {
    id: string;
    display_name: string;
  };
}

// Spotify API configuration
const CLIENT_ID = "976f26b37aa8487dba750c00ad20ecef";
const CLIENT_SECRET = "3ef2ad9ab7f24bb2ba7afbac207d57b6";
const BASE_URL = "https://api.spotify.com/v1";

// Sample data for fallback when API has issues
const SAMPLE_TRACKS = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumCover: "https://i.scdn.co/image/ab67616d0000b273c6d39d0bc56e872f55e3c0c5",
    audioSrc: "https://p.scdn.co/mp3-preview/6ecffa41a71b62f63a403c8408ef1a9ca2158105?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 203,
    artistId: "101",
    albumId: "1001",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    albumCover: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    audioSrc: "https://p.scdn.co/mp3-preview/84462d8e1e4d0f9e5ccd06f0da390f65843774a2?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 234,
    artistId: "102",
    albumId: "1002",
  },
  {
    id: "3",
    title: "Someone You Loved",
    artist: "Lewis Capaldi",
    albumCover: "https://i.scdn.co/image/ab67616d0000b2733e0698e4ae5db6adf74513c7",
    audioSrc: "https://p.scdn.co/mp3-preview/ceb88b056936a7c1d0b4e89336a5e480966d0e1a?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 182,
    artistId: "103",
    albumId: "1003",
  },
  {
    id: "4",
    title: "Bad Guy",
    artist: "Billie Eilish",
    albumCover: "https://i.scdn.co/image/ab67616d0000b273cb9266e4d4c21c584a5d997d",
    audioSrc: "https://p.scdn.co/mp3-preview/7e8f0078b6d7ca5c3cca623b5a371cd4c5c3807b?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 194,
    artistId: "104",
    albumId: "1004",
  },
  {
    id: "5",
    title: "Dance Monkey",
    artist: "Tones and I",
    albumCover: "https://i.scdn.co/image/ab67616d0000b273c6a1a337a1fd344670b4fb4f",
    audioSrc: "https://p.scdn.co/mp3-preview/5a5a1c0a24e4156714eb9a9fca9c4db38a4c699a?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 210,
    artistId: "105",
    albumId: "1005",
  },
  {
    id: "6",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    albumCover: "https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946",
    audioSrc: "https://p.scdn.co/mp3-preview/5e28fda0ab82a757ccf4a21897982b457104bec9?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 183,
    artistId: "106",
    albumId: "1006",
  },
  {
    id: "7",
    title: "Memories",
    artist: "Maroon 5",
    albumCover: "https://i.scdn.co/image/ab67616d0000b273bb6ce31c5bb3d47e6efafec7",
    audioSrc: "https://p.scdn.co/mp3-preview/bec520e6824a55629a6157f9f7f5a6f03ee0ba0a?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 189,
    artistId: "107",
    albumId: "1007",
  },
  {
    id: "8",
    title: "Circles",
    artist: "Post Malone",
    albumCover: "https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02",
    audioSrc: "https://p.scdn.co/mp3-preview/9cb7f4e5d8891a8dff38e18e32a6bb5b62404ae3?cid=976f26b37aa8487dba750c00ad20ecef",
    duration: 215,
    artistId: "108",
    albumId: "1008",
  }
];

// Sample artist data
const SAMPLE_ARTISTS = [
  {
    id: "101",
    name: "The Weeknd",
    image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
    genre: "R&B, Pop",
    bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. He has received numerous accolades, including three Grammy Awards."
  },
  {
    id: "102",
    name: "Ed Sheeran",
    image: "https://i.scdn.co/image/ab6761610000e5eb9e690225ad4445530612ccc9",
    genre: "Pop, Folk-Pop",
    bio: "Edward Christopher Sheeran MBE is an English singer, songwriter, musician, record producer, and actor. He has sold more than 150 million records worldwide."
  },
  {
    id: "103",
    name: "Lewis Capaldi",
    image: "https://i.scdn.co/image/ab6761610000e5eb3f2df1798860548c31850b3f",
    genre: "Pop, Indie",
    bio: "Lewis Capaldi is a Scottish singer-songwriter. He was nominated for the Critics' Choice Award at the 2019 Brit Awards."
  },
  {
    id: "104",
    name: "Billie Eilish",
    image: "https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf",
    genre: "Pop, Electropop",
    bio: "Billie Eilish Pirate Baird O'Connell is an American singer and songwriter. She first gained attention in 2015 when she uploaded the song 'Ocean Eyes' to SoundCloud."
  },
  {
    id: "105",
    name: "Tones and I",
    image: "https://i.scdn.co/image/ab6761610000e5eb57a85e67c4c6df2dda60e5b6",
    genre: "Pop, Indie Pop",
    bio: "Toni Watson, known professionally as Tones and I, is an Australian singer and songwriter. Her breakthrough came with her second single 'Dance Monkey'."
  },
  {
    id: "106",
    name: "Dua Lipa",
    image: "https://i.scdn.co/image/ab6761610000e5eb78fc1ba12ccaeced27db3cc9",
    genre: "Pop, Dance",
    bio: "Dua Lipa is an English singer and songwriter. After working as a model, she signed with Warner Music Group in 2015 and released her self-titled debut album in 2017."
  }
];

// Default genres for fallback
export const DEFAULT_GENRES = [
  { id: "1", name: "Pop", picture: "https://i.scdn.co/image/ab67706f000000028411c49bfed67e337fbfe8e4" },
  { id: "2", name: "Rock", picture: "https://i.scdn.co/image/ab67706f000000025dff32c3ea84f0406afba0c2" },
  { id: "3", name: "Hip Hop", picture: "https://i.scdn.co/image/ab67706f00000002caa115cbdb8cd3d39d67cdc0" },
  { id: "4", name: "Electronic", picture: "https://i.scdn.co/image/ab67706f00000002db32a17c1f5291b19261b845" }
];

// Function to get access token from Spotify
let accessToken = "";
let tokenExpiration = 0;

const getAccessToken = async () => {
  // Check if we already have a valid token
  if (accessToken && tokenExpiration > Date.now()) {
    return accessToken;
  }

  try {
    console.log("Fetching new Spotify access token");
    
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
      },
      body: "grant_type=client_credentials"
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get access token: ${error.error_description}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiration time (subtract 60 seconds to be safe)
    tokenExpiration = Date.now() + (data.expires_in - 60) * 1000;
    
    console.log("Successfully obtained Spotify access token");
    return accessToken;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    toast.error("Failed to authenticate with Spotify");
    throw error;
  }
};

// Function to make authenticated requests to Spotify API
const fetchFromSpotify = async (endpoint: string) => {
  try {
    const token = await getAccessToken();
    console.log(`Fetching from Spotify: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Spotify (${endpoint}):`, error);
    throw error;
  }
};

// Function to transform Spotify track to our Song format
export const transformTrackToSong = (track: SpotifyTrack) => {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists[0]?.name || "Unknown Artist",
    albumCover: track.album.images[1]?.url || track.album.images[0]?.url || "",
    audioSrc: track.preview_url || "",
    duration: Math.round(track.duration_ms / 1000),
    artistId: track.artists[0]?.id || "",
    albumId: track.album.id || "",
  };
};

// Function to transform Spotify artist to our Artist format
export const transformArtistToArtist = (artist: SpotifyArtist) => {
  return {
    id: artist.id,
    name: artist.name,
    image: artist.images[1]?.url || artist.images[0]?.url || "",
    genre: artist.genres?.join(", ") || "Unknown",
    bio: `${artist.name} has ${artist.followers?.total || 0} followers and a popularity score of ${artist.popularity || 0}.`,
  };
};

// Search for tracks
export const searchTracks = async (query: string) => {
  if (!query || query.trim() === '') {
    return SAMPLE_TRACKS;
  }
  
  try {
    const data = await fetchFromSpotify(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
    if (!data || !data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
      return SAMPLE_TRACKS.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) || 
        track.artist.toLowerCase().includes(query.toLowerCase())
      );
    }
    return data.tracks.items.map(transformTrackToSong);
  } catch (error) {
    console.error("Error searching tracks:", error);
    toast.error("Using sample data - Spotify API search failed");
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
    const data = await fetchFromSpotify(`/tracks/${trackId}`);
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
    const data = await fetchFromSpotify(`/artists/${artistId}`);
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
    const data = await fetchFromSpotify(`/artists/${artistId}/top-tracks?market=US`);
    if (!data || !data.tracks || !Array.isArray(data.tracks)) {
      return SAMPLE_TRACKS.filter(track => track.artistId === artistId);
    }
    return data.tracks.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting artist top tracks:", error);
    toast.error("Failed to get artist's top tracks");
    // Return filtered sample tracks as fallback
    return SAMPLE_TRACKS.filter(track => track.artistId === artistId);
  }
};

// Get chart tracks (popular tracks in Spotify)
export const getChartTracks = async (limit = 30) => {
  try {
    // Spotify doesn't have a direct "charts" endpoint in their API
    // Using their "Get Recommendations" endpoint with popular seeds
    const data = await fetchFromSpotify(`/browse/new-releases?limit=${limit}`);
    if (!data || !data.albums || !data.albums.items) {
      return SAMPLE_TRACKS.slice(0, limit);
    }
    
    // Get the tracks for each album
    const albumIds = data.albums.items.slice(0, 5).map((album: any) => album.id);
    const trackPromises = albumIds.map((id: string) => fetchFromSpotify(`/albums/${id}/tracks?limit=5`));
    const trackResults = await Promise.all(trackPromises);
    
    // Flatten and transform the tracks
    const tracks: SpotifyTrack[] = [];
    for (let i = 0; i < trackResults.length; i++) {
      const albumTracks = trackResults[i].items;
      const albumDetails = data.albums.items[i];
      
      // Add album details to each track
      for (const track of albumTracks) {
        track.album = {
          id: albumDetails.id,
          name: albumDetails.name,
          images: albumDetails.images,
          release_date: albumDetails.release_date,
          total_tracks: albumDetails.total_tracks
        };
      }
      
      tracks.push(...albumTracks);
    }
    
    // Get full details for the tracks
    const trackIds = tracks.map(track => track.id).join(',');
    const fullTrackData = await fetchFromSpotify(`/tracks?ids=${trackIds}`);
    
    if (!fullTrackData || !fullTrackData.tracks) {
      return SAMPLE_TRACKS.slice(0, limit);
    }
    
    return fullTrackData.tracks.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting chart tracks:", error);
    toast.error("Using sample data - Spotify API charts failed");
    // Return sample tracks as fallback
    return SAMPLE_TRACKS.slice(0, limit);
  }
};

// Get recommendations based on a track
export const getRecommendations = async (trackId: string, limit = 10) => {
  try {
    const data = await fetchFromSpotify(`/recommendations?seed_tracks=${trackId}&limit=${limit}`);
    if (!data || !data.tracks || !Array.isArray(data.tracks)) {
      throw new Error("Invalid response from recommendations endpoint");
    }
    return data.tracks.map(transformTrackToSong);
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
  if (!query || query.trim() === '') {
    return SAMPLE_ARTISTS;
  }
  
  try {
    const data = await fetchFromSpotify(`/search?q=${encodeURIComponent(query)}&type=artist&limit=20`);
    if (!data || !data.artists || !data.artists.items) {
      return SAMPLE_ARTISTS.filter(artist => 
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return data.artists.items.map(transformArtistToArtist);
  } catch (error) {
    console.error("Error searching artists:", error);
    toast.error("Using sample data - Spotify API search failed");
    // Return filtered sample artists as fallback
    return SAMPLE_ARTISTS.filter(artist => 
      artist.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Get artist albums
export const getArtistAlbums = async (artistId: string, limit = 10) => {
  try {
    const data = await fetchFromSpotify(`/artists/${artistId}/albums?limit=${limit}`);
    if (!data || !data.items) {
      return [];
    }
    
    return data.items.map((album: any) => ({
      id: album.id,
      title: album.name,
      cover: album.images[1]?.url || album.images[0]?.url,
      releaseDate: album.release_date,
      trackCount: album.total_tracks,
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
    const data = await fetchFromSpotify(`/playlists/${playlistId}`);
    if (!data || !data.tracks || !data.tracks.items) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      songs: data.tracks.items.map((item: any) => transformTrackToSong(item.track)),
      createdAt: new Date(data.snapshot_id),
      cover: data.images[0]?.url
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
    const data = await fetchFromSpotify(`/albums/${albumId}/tracks`);
    if (!data || !data.items) {
      return [];
    }
    
    // We need to get the full track info including preview URLs
    const trackIds = data.items.map((track: any) => track.id).join(',');
    const tracksData = await fetchFromSpotify(`/tracks?ids=${trackIds}`);
    
    if (!tracksData || !tracksData.tracks) {
      return [];
    }
    
    return tracksData.tracks.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting album tracks:", error);
    toast.error("Failed to get album tracks");
    return [];
  }
};

// Get genre list
export const getGenres = async () => {
  try {
    const data = await fetchFromSpotify(`/browse/categories?limit=20`);
    if (!data || !data.categories || !data.categories.items) {
      return DEFAULT_GENRES;
    }
    
    return data.categories.items.map((genre: any) => ({
      id: genre.id,
      name: genre.name,
      picture: genre.icons[0]?.url
    }));
  } catch (error) {
    console.error("Error getting genres:", error);
    toast.error("Failed to get genres");
    return DEFAULT_GENRES;
  }
};
