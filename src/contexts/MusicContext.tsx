
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Types
interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  audioSrc: string;
  duration: number;
}

interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  bio: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
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
  playSong: (song: Song) => void;
  pauseSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  createPlaylist: (name: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  searchSongs: (query: string) => Song[];
  searchArtists: (query: string) => Artist[];
}

// Mock data
const mockSongs: Song[] = [
  {
    id: "1",
    title: "Tranquil Mornings",
    artist: "Serene Echo",
    albumCover: "/placeholder.svg",
    audioSrc: "#",
    duration: 235,
  },
  {
    id: "2",
    title: "Midnight Memories",
    artist: "Luna Wave",
    albumCover: "/placeholder.svg",
    audioSrc: "#",
    duration: 198,
  },
  {
    id: "3",
    title: "Digital Dreams",
    artist: "Pixel Pulse",
    albumCover: "/placeholder.svg",
    audioSrc: "#",
    duration: 267,
  },
  {
    id: "4",
    title: "Ocean Reflections",
    artist: "Coastal Mind",
    albumCover: "/placeholder.svg",
    audioSrc: "#",
    duration: 221,
  },
  {
    id: "5",
    title: "Urban Symphony",
    artist: "City Sounds",
    albumCover: "/placeholder.svg",
    audioSrc: "#",
    duration: 312,
  },
  {
    id: "6",
    title: "Ethereal Whispers",
    artist: "Astral Voices",
    albumCover: "/placeholder.svg",
    audioSrc: "#",
    duration: 176,
  },
];

const mockArtists: Artist[] = [
  {
    id: "1",
    name: "Serene Echo",
    image: "/placeholder.svg",
    genre: "Ambient",
    bio: "Creating calm soundscapes for tranquil moments.",
  },
  {
    id: "2",
    name: "Luna Wave",
    image: "/placeholder.svg",
    genre: "Electronic",
    bio: "Melodic electronic music inspired by nocturnal themes.",
  },
  {
    id: "3",
    name: "Pixel Pulse",
    image: "/placeholder.svg",
    genre: "Synth",
    bio: "Retro-futuristic compositions with digital textures.",
  },
  {
    id: "4",
    name: "Coastal Mind",
    image: "/placeholder.svg",
    genre: "Lo-fi",
    bio: "Relaxing beats inspired by coastal landscapes.",
  },
  {
    id: "5",
    name: "City Sounds",
    image: "/placeholder.svg",
    genre: "Jazz Fusion",
    bio: "Merging traditional jazz with urban influences.",
  },
  {
    id: "6",
    name: "Astral Voices",
    image: "/placeholder.svg",
    genre: "Ethereal",
    bio: "Vocal-centric compositions with otherworldly atmospheres.",
  },
];

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [songs] = useState<Song[]>(mockSongs);
  const [artists] = useState<Artist[]>(mockArtists);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: "default",
      name: "Favorites",
      songs: [mockSongs[0], mockSongs[2]],
      createdAt: new Date(),
    },
  ]);
  const [queue, setQueue] = useState<Song[]>([]);

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
    // If queue is empty, add next 3 songs after this one to queue
    if (queue.length === 0) {
      const songIndex = songs.findIndex((s) => s.id === song.id);
      const nextSongs = [...songs.slice(songIndex + 1, songIndex + 4)];
      setQueue(nextSongs);
    }
    toast.success(`Now playing: ${song.title}`);
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
    } else if (currentSong) {
      // Find next song in the list
      const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
      if (currentIndex < songs.length - 1) {
        const nextSong = songs[currentIndex + 1];
        setCurrentSong(nextSong);
        setProgress(0);
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
    };
    setPlaylists([...playlists, newPlaylist]);
    toast.success(`Created playlist: ${name}`);
  };

  const searchSongs = (query: string): Song[] => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery)
    );
  };

  const searchArtists = (query: string): Artist[] => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(lowerQuery) ||
        artist.genre.toLowerCase().includes(lowerQuery)
    );
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
