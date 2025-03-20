import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  addSong: (song: Song) => Promise<void>;
  removeSong: (songId: string) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Sample tracks for fallback
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

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [songs, setSongs] = useState<Song[]>(SAMPLE_TRACKS); // Initialize with sample tracks immediately
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>(SAMPLE_TRACKS); // Initialize with sample tracks immediately
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    // Clean up audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Create default playlist if none exists - do this first
        let initialPlaylists: Playlist[] = [
          {
            id: "default",
            name: "Favorites",
            songs: [],
            createdAt: new Date(),
            cover: "/placeholder.svg"
          },
        ];
        
        // Get chart tracks for trending songs
        let chartTracks = SAMPLE_TRACKS; // Start with sample tracks
        
        try {
          const apiTracks = await api.getChartTracks();
          if (apiTracks && apiTracks.length > 0) {
            chartTracks = apiTracks;
            console.log("Successfully loaded chart tracks from API");
          }
        } catch (error) {
          console.error("Failed to load chart tracks:", error);
          toast.error("Using sample tracks - API unavailable");
          setHasError(true);
        }
        
        setTrendingSongs(chartTracks);
        setSongs(chartTracks);
        
        // Load stored playlists from localStorage
        const storedPlaylists = localStorage.getItem('playlists');
        if (storedPlaylists) {
          try {
            const parsedPlaylists = JSON.parse(storedPlaylists);
            // Convert string dates back to Date objects
            const formattedPlaylists = parsedPlaylists.map((playlist: any) => ({
              ...playlist,
              createdAt: new Date(playlist.createdAt)
            }));
            setPlaylists(formattedPlaylists);
          } catch (parseError) {
            console.error("Failed to parse playlists:", parseError);
            // Use default playlist if parsing fails
            setPlaylists(initialPlaylists);
            toast.error("Failed to load playlists, using default");
          }
        } else {
          // Use default playlist if none exists
          setPlaylists(initialPlaylists);
        }
        
        // Load recently played from localStorage
        const storedRecentlyPlayed = localStorage.getItem('recentlyPlayed');
        if (storedRecentlyPlayed) {
          try {
            setRecentlyPlayed(JSON.parse(storedRecentlyPlayed));
          } catch (parseError) {
            console.error("Failed to parse recently played:", parseError);
            setRecentlyPlayed([]);
          }
        }
        
      } catch (error) {
        console.error("Failed to load initial data:", error);
        toast.error("Failed to load music data - using fallbacks");
        
        // Ensure we always have some data even if everything fails
        setTrendingSongs(SAMPLE_TRACKS);
        setSongs(SAMPLE_TRACKS);
        setHasError(true);
        
        // Still create a default playlist
        setPlaylists([
          {
            id: "default",
            name: "Favorites",
            songs: [],
            createdAt: new Date(),
            cover: "/placeholder.svg"
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle audio playing state and volume changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        // Handle play() promise to avoid DOMException
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Audio play error:", error);
            // Autoplay was prevented, set playing state to false
            setIsPlaying(false);
            toast.error("Audio playback was blocked", {
              description: "Try clicking play again"
            });
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update audio source when current song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioSrc;
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Audio play error:", error);
            setIsPlaying(false);
            toast.error("Couldn't play audio", {
              description: "Try another song or check internet connection"
            });
          });
        }
      }
    }
  }, [currentSong]);

  // Save playlists to localStorage when they change
  useEffect(() => {
    if (playlists && playlists.length > 0) {
      localStorage.setItem('playlists', JSON.stringify(playlists));
    }
  }, [playlists]);

  // Save recently played to localStorage when it changes
  useEffect(() => {
    if (recentlyPlayed && recentlyPlayed.length > 0) {
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    }
  }, [recentlyPlayed]);

  // Track audio progress
  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      setProgress(audioRef.current?.currentTime || 0);
    };

    const handleSongEnd = () => {
      nextSong();
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', handleSongEnd);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleSongEnd);
      }
    };
  }, [currentSong]);

  const playSong = (song: Song) => {
    if (!song) {
      toast.error("Cannot play invalid song");
      return;
    }
    
    // Check if audio source is valid
    if (!song.audioSrc) {
      toast.error("This song doesn't have a valid audio source");
      return;
    }
    
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
    if (!songId) return;
    
    try {
      const recommendations = await api.getRecommendations(songId);
      if (recommendations && recommendations.length > 0) {
        setQueue(recommendations.filter(s => s.id !== songId));
      } else {
        // Use other songs from sample tracks as recommendations if API returns empty
        const fallbackRecommendations = SAMPLE_TRACKS.filter(s => s.id !== songId);
        setQueue(fallbackRecommendations);
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      // Use other songs from sample tracks as recommendations
      const fallbackRecommendations = SAMPLE_TRACKS.filter(s => s.id !== songId);
      setQueue(fallbackRecommendations);
    }
  };

  const addToRecentlyPlayed = (song: Song) => {
    if (!song) return;
    
    setRecentlyPlayed(prev => {
      // Handle the case where prev might be null or undefined
      const safeList = prev || [];
      
      // Remove if already exists
      const filtered = safeList.filter(s => s && s.id !== song.id);
      
      // Add to beginning and limit to 20 songs
      return [song, ...filtered].slice(0, 20);
    });
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const nextSong = () => {
    if (queue && queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setProgress(0);
      setQueue(queue.slice(1));
      addToRecentlyPlayed(nextSong);
    } else if (currentSong && songs && songs.length > 0) {
      // Find next song in the list
      const currentIndex = songs.findIndex((s) => s && s.id === currentSong.id);
      if (currentIndex >= 0 && currentIndex < songs.length - 1) {
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
      if (audioRef.current && audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
        setProgress(0);
        return;
      }
      
      // Find previous song in the list
      const currentIndex = songs.findIndex((s) => s && s.id === currentSong.id);
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
    if (!playlistId || !songId) {
      toast.error("Invalid playlist or song");
      return;
    }
    
    const playlistIndex = playlists.findIndex((p) => p && p.id === playlistId);
    if (playlistIndex !== -1) {
      const song = songs.find((s) => s && s.id === songId);
      if (song) {
        // Check if song already exists in playlist
        const songExists = playlists[playlistIndex].songs.some((s) => s && s.id === songId);
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
    if (!playlistId || !songId) return;
    
    const playlistIndex = playlists.findIndex((p) => p && p.id === playlistId);
    if (playlistIndex !== -1) {
      const updatedPlaylists = [...playlists];
      updatedPlaylists[playlistIndex] = {
        ...updatedPlaylists[playlistIndex],
        songs: updatedPlaylists[playlistIndex].songs.filter((s) => s && s.id !== songId),
      };
      setPlaylists(updatedPlaylists);
      toast.success("Removed from playlist");
    }
  };

  const createPlaylist = (name: string) => {
    if (!name || name.trim() === '') {
      toast.error("Playlist name cannot be empty");
      return;
    }
    
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
    if (!query || query.trim() === '') return SAMPLE_TRACKS;
    
    setIsLoading(true);
    try {
      const results = await api.searchTracks(query);
      return results && results.length > 0 ? results : SAMPLE_TRACKS.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) || 
        track.artist.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching songs:", error);
      toast.error("Search API failed, using sample data");
      // Filter sample tracks as fallback
      return SAMPLE_TRACKS.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) || 
        track.artist.toLowerCase().includes(query.toLowerCase())
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchArtists = async (query: string): Promise<Artist[]> => {
    if (!query || query.trim() === '') return [];
    
    // Due to limitations in the free API, we'll simulate artist search
    // by extracting artists from track search results
    setIsLoading(true);
    try {
      const tracks = await api.searchTracks(query);
      
      if (!tracks || tracks.length === 0) {
        // Create sample artists from sample tracks if API fails
        const uniqueArtists = new Map<string, Artist>();
        SAMPLE_TRACKS.filter(track => 
          track.artist.toLowerCase().includes(query.toLowerCase())
        ).forEach(track => {
          if (track.artistId && !uniqueArtists.has(track.artistId)) {
            uniqueArtists.set(track.artistId, {
              id: track.artistId,
              name: track.artist,
              image: track.albumCover,
              genre: "Unknown",
              bio: `Popular artist with hits like ${track.title}`,
            });
          }
        });
        return Array.from(uniqueArtists.values());
      }
      
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
      // Create sample artists from sample tracks
      const uniqueArtists = new Map<string, Artist>();
      SAMPLE_TRACKS.filter(track => 
        track.artist.toLowerCase().includes(query.toLowerCase())
      ).forEach(track => {
        if (track.artistId && !uniqueArtists.has(track.artistId)) {
          uniqueArtists.set(track.artistId, {
            id: track.artistId,
            name: track.artist,
            image: track.albumCover,
            genre: "Unknown",
            bio: `Popular artist with hits like ${track.title}`,
          });
        }
      });
      return Array.from(uniqueArtists.values());
    } finally {
      setIsLoading(false);
    }
  };

  const getArtistSongs = async (artistId: string): Promise<Song[]> => {
    if (!artistId) return [];
    
    setIsLoading(true);
    try {
      const tracks = await api.getArtistTopTracks(artistId);
      return tracks && tracks.length > 0 ? tracks : SAMPLE_TRACKS.filter(track => track.artistId === artistId);
    } catch (error) {
      console.error("Error getting artist songs:", error);
      toast.error("Failed to load artist tracks, using samples");
      // Filter sample tracks by artistId as fallback
      return SAMPLE_TRACKS.filter(track => track.artistId === artistId);
    } finally {
      setIsLoading(false);
    }
  };

  const addSong = async (song: Song): Promise<void> => {
    if (!song || !song.id) {
      toast.error("Invalid song data");
      return;
    }
    
    try {
      // Add song to the songs array
      setSongs(prevSongs => {
        // Check if song with the same ID already exists
        const exists = prevSongs.some(s => s.id === song.id);
        if (exists) {
          toast.error("Song with this ID already exists");
          return prevSongs;
        }
        return [song, ...prevSongs];
      });
      
      // If this is a trending song, add it to trending songs as well
      setTrendingSongs(prevTrending => {
        // Only add to trending if it's not already there and limit to 10
        const exists = prevTrending.some(s => s.id === song.id);
        if (exists) return prevTrending;
        return [song, ...prevTrending].slice(0, 10);
      });
      
      toast.success(`Song "${song.title}" added successfully`);
    } catch (error) {
      console.error("Failed to add song:", error);
      toast.error("Failed to add song");
      throw error;
    }
  };
  
  const removeSong = async (songId: string): Promise<void> => {
    if (!songId) {
      toast.error("Invalid song ID");
      return;
    }
    
    try {
      // Remove song from songs array
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
      
      // Remove from trending songs if present
      setTrendingSongs(prevTrending => prevTrending.filter(song => song.id !== songId));
      
      // Remove from queue if present
      setQueue(prevQueue => prevQueue.filter(song => song.id !== songId));
      
      // Remove from recently played if present
      setRecentlyPlayed(prevRecent => prevRecent.filter(song => song.id !== songId));
      
      // Remove from all playlists
      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => ({
          ...playlist,
          songs: playlist.songs.filter(song => song.id !== songId)
        }))
      );
      
      // If it's the current song, stop playing and clear current song
      if (currentSong && currentSong.id === songId) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
        setCurrentSong(null);
      }
      
      toast.success("Song removed successfully");
    } catch (error) {
      console.error("Failed to remove song:", error);
      toast.error("Failed to remove song");
      throw error;
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
        addSong,
        removeSong,
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
