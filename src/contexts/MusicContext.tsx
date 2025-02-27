
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";

// Types
export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  audioSrc: string;
  duration: number;
  artistId?: string;
  albumId?: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  bio: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
  cover?: string;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
  queue: Song[];
  trendingSongs: Song[];
  recentlyPlayed: Song[];
  isLoading: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  createPlaylist: (name: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  searchSongs: (query: string) => Promise<Song[]>;
  searchArtists: (query: string) => Promise<Artist[]>;
  getArtistSongs: (artistId: string) => Promise<Song[]>;
  addToRecentlyPlayed: (song: Song) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        // Get chart tracks for trending songs
        const chartTracks = await api.getChartTracks();
        setTrendingSongs(chartTracks);
        setSongs(chartTracks);
        
        // Load stored playlists from localStorage
        const storedPlaylists = localStorage.getItem('playlists');
        if (storedPlaylists) {
          const parsedPlaylists = JSON.parse(storedPlaylists);
          // Convert string dates back to Date objects
          const formattedPlaylists = parsedPlaylists.map((playlist: any) => ({
            ...playlist,
            createdAt: new Date(playlist.createdAt)
          }));
          setPlaylists(formattedPlaylists);
        } else {
          // Create default playlist if none exists
          setPlaylists([
            {
              id: "default",
              name: "Favorites",
              songs: [],
              createdAt: new Date(),
              cover: "/placeholder.svg"
            },
          ]);
        }
        
        // Load recently played from localStorage
        const storedRecentlyPlayed = localStorage.getItem('recentlyPlayed');
        if (storedRecentlyPlayed) {
          setRecentlyPlayed(JSON.parse(storedRecentlyPlayed));
        }
        
      } catch (error) {
        console.error("Failed to load initial data:", error);
        toast.error("Failed to load music data");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save playlists to localStorage when they change
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem('playlists', JSON.stringify(playlists));
    }
  }, [playlists]);

  // Save recently played to localStorage when it changes
  useEffect(() => {
    if (recentlyPlayed.length > 0) {
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    }
  }, [recentlyPlayed]);

  // Simulate progress bar updating when a song is playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          if (newProgress >= currentSong.duration) {
            // Song ended, play next song if available
            nextSong();
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSong]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    
    // Add to recently played
    addToRecentlyPlayed(song);
    
    // If queue is empty, add recommendations
    if (queue.length === 0) {
      getRecommendationsForQueue(song.id);
    }
    
    toast.success(`Now playing: ${song.title}`);
  };

  const getRecommendationsForQueue = async (songId: string) => {
    try {
      const recommendations = await api.getRecommendations(songId);
      if (recommendations.length > 0) {
        setQueue(recommendations.filter(s => s.id !== songId));
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
  };

  const addToRecentlyPlayed = (song: Song) => {
    setRecentlyPlayed(prev => {
      // Remove if already exists
      const filtered = prev.filter(s => s.id !== song.id);
      // Add to beginning and limit to 20 songs
      return [song, ...filtered].slice(0, 20);
    });
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const nextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setProgress(0);
      setQueue(queue.slice(1));
      addToRecentlyPlayed(nextSong);
    } else if (currentSong) {
      // Find next song in the list
      const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
      if (currentIndex < songs.length - 1) {
        const nextSong = songs[currentIndex + 1];
        setCurrentSong(nextSong);
        setProgress(0);
        addToRecentlyPlayed(nextSong);
      } else {
        // End of songs list
        setIsPlaying(false);
        setCurrentSong(null);
        setProgress(0);
      }
    }
  };

  const prevSong = () => {
    if (currentSong) {
      // If progress is more than 3 seconds, restart song
      if (progress > 3) {
        setProgress(0);
        return;
      }
      
      // Find previous song in the list
      const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
      if (currentIndex > 0) {
        const prevSong = songs[currentIndex - 1];
        setCurrentSong(prevSong);
        setProgress(0);
        addToRecentlyPlayed(prevSong);
      }
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const addToPlaylist = (playlistId: string, songId: string) => {
    const playlistIndex = playlists.findIndex((p) => p.id === playlistId);
    if (playlistIndex !== -1) {
      const song = songs.find((s) => s.id === songId);
      if (song) {
        // Check if song already exists in playlist
        const songExists = playlists[playlistIndex].songs.some((s) => s.id === songId);
        if (songExists) {
          toast.error("Song already in playlist");
          return;
        }
        
        const updatedPlaylists = [...playlists];
        updatedPlaylists[playlistIndex] = {
          ...updatedPlaylists[playlistIndex],
          songs: [...updatedPlaylists[playlistIndex].songs, song],
        };
        setPlaylists(updatedPlaylists);
        toast.success(`Added to ${playlists[playlistIndex].name}`);
      }
    }
  };

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    const playlistIndex = playlists.findIndex((p) => p.id === playlistId);
    if (playlistIndex !== -1) {
      const updatedPlaylists = [...playlists];
      updatedPlaylists[playlistIndex] = {
        ...updatedPlaylists[playlistIndex],
        songs: updatedPlaylists[playlistIndex].songs.filter((s) => s.id !== songId),
      };
      setPlaylists(updatedPlaylists);
      toast.success("Removed from playlist");
    }
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      songs: [],
      createdAt: new Date(),
      cover: "/placeholder.svg"
    };
    setPlaylists([...playlists, newPlaylist]);
    toast.success(`Created playlist: ${name}`);
  };

  const searchSongs = async (query: string): Promise<Song[]> => {
    if (!query) return [];
    setIsLoading(true);
    try {
      const results = await api.searchTracks(query);
      return results;
    } catch (error) {
      console.error("Error searching songs:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchArtists = async (query: string): Promise<Artist[]> => {
    if (!query) return [];
    // Due to limitations in the free Deezer API, we'll simulate artist search
    // by extracting artists from track search results
    setIsLoading(true);
    try {
      const tracks = await api.searchTracks(query);
      
      // Extract unique artists
      const uniqueArtists = new Map<string, Artist>();
      tracks.forEach(track => {
        if (track.artistId && !uniqueArtists.has(track.artistId)) {
          uniqueArtists.set(track.artistId, {
            id: track.artistId,
            name: track.artist,
            image: track.albumCover, // Using album cover as artist image
            genre: "Unknown",
            bio: `Popular artist with hits like ${track.title}`,
          });
        }
      });
      
      return Array.from(uniqueArtists.values());
    } catch (error) {
      console.error("Error searching artists:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getArtistSongs = async (artistId: string): Promise<Song[]> => {
    setIsLoading(true);
    try {
      const tracks = await api.getArtistTopTracks(artistId);
      return tracks;
    } catch (error) {
      console.error("Error getting artist songs:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        progress,
        songs,
        artists,
        playlists,
        queue,
        trendingSongs,
        recentlyPlayed,
        isLoading,
        playSong,
        pauseSong,
        nextSong,
        prevSong,
        setVolume,
        addToPlaylist,
        createPlaylist,
        removeFromPlaylist,
        searchSongs,
        searchArtists,
        getArtistSongs,
        addToRecentlyPlayed,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
