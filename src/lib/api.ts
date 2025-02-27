
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

const BASE_URL = "https://cors-anywhere.herokuapp.com/https://api.deezer.com";

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

// Search for tracks
export const searchTracks = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to search tracks");
    }
    const data: DeezerSearchResult = await response.json();
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error searching tracks:", error);
    toast.error("Failed to search for tracks");
    return [];
  }
};

// Get track details
export const getTrack = async (trackId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/track/${trackId}`);
    if (!response.ok) {
      throw new Error("Failed to get track");
    }
    const data: DeezerTrack = await response.json();
    return transformTrackToSong(data);
  } catch (error) {
    console.error("Error getting track:", error);
    toast.error("Failed to get track details");
    return null;
  }
};

// Get artist details
export const getArtist = async (artistId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/artist/${artistId}`);
    if (!response.ok) {
      throw new Error("Failed to get artist");
    }
    const data: DeezerArtistDetails = await response.json();
    return transformArtistToArtist(data);
  } catch (error) {
    console.error("Error getting artist:", error);
    toast.error("Failed to get artist details");
    return null;
  }
};

// Get artist top tracks
export const getArtistTopTracks = async (artistId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/artist/${artistId}/top?limit=10`);
    if (!response.ok) {
      throw new Error("Failed to get artist top tracks");
    }
    const data: DeezerArtistTopTracks = await response.json();
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting artist top tracks:", error);
    toast.error("Failed to get artist's top tracks");
    return [];
  }
};

// Get chart tracks
export const getChartTracks = async (limit = 30) => {
  try {
    const response = await fetch(`${BASE_URL}/chart/0/tracks?limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to get chart tracks");
    }
    const data: DeezerArtistTopTracks = await response.json();
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting chart tracks:", error);
    toast.error("Failed to get chart tracks");
    return [];
  }
};

// Get recommendations based on a track
export const getRecommendations = async (trackId: string, limit = 10) => {
  try {
    // Deezer doesn't have direct recommendations API, using radio instead
    const response = await fetch(`${BASE_URL}/radio/tracks`);
    if (!response.ok) {
      throw new Error("Failed to get recommendations");
    }
    const data: DeezerArtistTopTracks = await response.json();
    return data.data.map(transformTrackToSong);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    toast.error("Failed to get recommendations");
    return [];
  }
};
