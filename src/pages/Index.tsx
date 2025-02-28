
import React, { useState, useEffect } from "react";
import { useMusic } from "@/contexts/MusicContext";
import { Link } from "react-router-dom";
import SongCard from "@/components/SongCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Disc3, Headphones, ListMusic, Sparkles, Volume2, Music2, Disc, Radio } from "lucide-react";
import * as api from "@/lib/api";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

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

const DEFAULT_GENRES = [
  { id: "1", name: "Pop", picture: "https://e-cdns-images.dzcdn.net/images/misc/db7a604d9e7634a67d45cfc86b7f4866/500x500-000000-80-0-0.jpg" },
  { id: "2", name: "Rock", picture: "https://e-cdns-images.dzcdn.net/images/misc/b36ca681667f48421a733aab7a17fc17/500x500-000000-80-0-0.jpg" },
  { id: "3", name: "Hip Hop", picture: "https://e-cdns-images.dzcdn.net/images/misc/4bcd469d3b555cc9999980325d172ae5/500x500-000000-80-0-0.jpg" },
  { id: "4", name: "Electronic", picture: "https://e-cdns-images.dzcdn.net/images/misc/f3bc07e7a4e03a701c55f386c55e6150/500x500-000000-80-0-0.jpg" }
];

const Home = () => {
  const { recentlyPlayed, playlists, playSong, isLoading } = useMusic();
  const [trendingTracks, setTrendingTracks] = useState<any[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLocalLoading(true);
        
        // Fetch trending tracks from Deezer
        let chartTracks;
        try {
          chartTracks = await api.getChartTracks(10);
        } catch (error) {
          console.error("Failed to fetch trending tracks:", error);
          chartTracks = SAMPLE_TRACKS;
          toast.error("Using sample trending tracks", {
            description: "Deezer API is currently unavailable"
          });
        }
        
        setTrendingTracks(chartTracks);
        
        // Create featured artists from tracks
        const artistMap = new Map();
        chartTracks.forEach(track => {
          if (track.artistId && !artistMap.has(track.artistId)) {
            artistMap.set(track.artistId, {
              id: track.artistId,
              name: track.artist,
              image: track.albumCover
            });
          }
        });
        setFeaturedArtists(Array.from(artistMap.values()).slice(0, 6));
        
        // Fetch genres
        try {
          const genreList = await api.getGenres();
          setGenres(genreList.slice(0, 8));
        } catch (error) {
          console.error("Failed to fetch genres:", error);
          setGenres(DEFAULT_GENRES);
          toast.error("Using default genres", {
            description: "Couldn't load genre data from Deezer"
          });
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set fallback data
        setTrendingTracks(SAMPLE_TRACKS);
        
        // Create featured artists from sample tracks
        const artistMap = new Map();
        SAMPLE_TRACKS.forEach(track => {
          if (track.artistId && !artistMap.has(track.artistId)) {
            artistMap.set(track.artistId, {
              id: track.artistId,
              name: track.artist,
              image: track.albumCover
            });
          }
        });
        setFeaturedArtists(Array.from(artistMap.values()).slice(0, 6));
        
        // Set default genres
        setGenres(DEFAULT_GENRES);
        
        toast.error("Using sample data", {
          description: "Couldn't load data from Deezer API"
        });
      } finally {
        setLocalLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  
  // Get a section gradient class
  const getSectionGradient = (index: number) => {
    const gradients = [
      "from-indigo-500/20 to-purple-500/20",
      "from-rose-500/20 to-orange-500/20",
      "from-cyan-500/20 to-blue-500/20",
      "from-emerald-500/20 to-teal-500/20"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="pb-24">
      {/* Hero section */}
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Left content */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Stream With Deezer <br /> Integration
            </h1>
            <p className="text-white/70 mb-6 max-w-md">
              Explore millions of tracks from Deezer, personalized playlists, and the latest releases. Stream anytime, anywhere.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-0 text-white"
                onClick={() => {
                  if (trendingTracks && trendingTracks.length > 0) {
                    playSong(trendingTracks[0]);
                    toast.success(`Now playing: ${trendingTracks[0].title}`);
                  } else {
                    toast.error("No tracks available to play");
                  }
                }}
                disabled={!trendingTracks || trendingTracks.length === 0}
              >
                <Play size={18} className="mr-2" />
                Play Top Track
              </Button>
              <Link to="/library">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/5 text-white border-white/10 hover:bg-white/10"
                >
                  Browse Library
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right content - music animation */}
          <div className="md:w-80 h-80 relative hidden md:block">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-indigo-500/30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-indigo-500/40 animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Headphones size={40} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-10">
        {/* Trending now section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Trending From Deezer
              </span>
            </h2>
            <Link to="/library" className="text-sm text-white/70 hover:text-white flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          {localLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-lg bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                  <Skeleton className="h-3 w-1/2 bg-white/5" />
                </div>
              ))}
            </div>
          ) : trendingTracks && trendingTracks.length > 0 ? (
            <ScrollArea className="pb-4">
              <div className="flex space-x-4">
                {trendingTracks.map(song => (
                  <div key={song.id} className="w-40 flex-shrink-0">
                    <SongCard song={song} variant="grid" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 glass-card">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-white/70" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">No trending tracks available</h3>
              <p className="text-white/70 max-w-md mx-auto mb-6">
                We couldn't load trending tracks from Deezer at the moment. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-white/10 text-white hover:bg-white/20 border-0"
              >
                Refresh Page
              </Button>
            </div>
          )}
        </section>
        
        {/* Music Genres section */}
        <section className={`p-6 rounded-xl bg-gradient-to-r ${getSectionGradient(1)} border border-white/5`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Radio size={20} className="text-rose-400" />
              <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                Music Genres
              </span>
            </h2>
          </div>
          
          {localLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg bg-white/5" />
              ))}
            </div>
          ) : genres && genres.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {genres.map(genre => (
                <Link 
                  key={genre.id} 
                  to={`/library?genre=${genre.id}`}
                  className="relative h-24 rounded-lg overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 group-hover:from-black/50 group-hover:to-black/30 transition-all duration-300 z-10"></div>
                  {genre.picture ? (
                    <img 
                      src={genre.picture} 
                      alt={genre.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-500/30 to-orange-500/30 flex items-center justify-center">
                      <Music2 size={30} className="text-white/70" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <h3 className="text-lg font-bold text-white">{genre.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 glass-card">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                <Radio size={24} className="text-white/70" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">No genres available</h3>
              <p className="text-white/70 max-w-md mx-auto mb-6">
                We couldn't load music genres at the moment. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-white/10 text-white hover:bg-white/20 border-0"
              >
                Refresh Page
              </Button>
            </div>
          )}
        </section>
        
        {/* Recently played section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Disc3 size={20} className="text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Recently Played
              </span>
            </h2>
            <Link to="/library?tab=recent" className="text-sm text-white/70 hover:text-white flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-lg bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                  <Skeleton className="h-3 w-1/2 bg-white/5" />
                </div>
              ))}
            </div>
          ) : recentlyPlayed && recentlyPlayed.length > 0 ? (
            <ScrollArea className="pb-4">
              <div className="flex space-x-4">
                {recentlyPlayed.slice(0, 10).map((song, index) => (
                  <div key={`${song.id}-${index}`} className="w-40 flex-shrink-0">
                    <SongCard song={song} variant="grid" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 glass-card">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                <Volume2 size={24} className="text-white/70" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">No recent activity</h3>
              <p className="text-white/70 max-w-md mx-auto mb-6">
                Start playing songs to build your recent history
              </p>
              <Link to="/library">
                <Button 
                  className="bg-white/10 text-white hover:bg-white/20 border-0"
                >
                  Browse Library
                </Button>
              </Link>
            </div>
          )}
        </section>
        
        {/* Featured artists section */}
        <section className={`p-6 rounded-xl bg-gradient-to-r ${getSectionGradient(2)} border border-white/5`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Headphones size={20} className="text-emerald-400" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Popular Artists on Deezer
              </span>
            </h2>
            <Link to="/artists" className="text-sm text-white/70 hover:text-white flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          {localLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Skeleton className="aspect-square rounded-full bg-white/5 mb-3" />
                  <Skeleton className="h-4 w-3/4 mx-auto bg-white/5 mb-2" />
                  <Skeleton className="h-3 w-1/2 mx-auto bg-white/5" />
                </div>
              ))}
            </div>
          ) : featuredArtists && featuredArtists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {featuredArtists.map(artist => (
                <Link key={artist.id} to={`/artists?id=${artist.id}`} className="group">
                  <div className="aspect-square rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20 mb-3">
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-center font-medium">{artist.name}</h3>
                  <p className="text-center text-sm text-white/50">Artist</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 glass-card">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                <Headphones size={24} className="text-white/70" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">No artists available</h3>
              <p className="text-white/70 max-w-md mx-auto mb-6">
                We couldn't load featured artists at the moment. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-white/10 text-white hover:bg-white/20 border-0"
              >
                Refresh Page
              </Button>
            </div>
          )}
        </section>
        
        {/* Your playlists section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <ListMusic size={20} className="text-violet-400" />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Your Playlists
              </span>
            </h2>
            <Link to="/playlists" className="text-sm text-white/70 hover:text-white flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg bg-white/5" />
              ))}
            </div>
          ) : playlists && playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {playlists.slice(0, 3).map(playlist => (
                <Link 
                  key={playlist.id} 
                  to={`/playlists?id=${playlist.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-gradient-to-br from-purple-500/30 to-indigo-500/30 flex-shrink-0">
                    {playlist.songs && playlist.songs.length > 0 ? (
                      <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                        {playlist.songs.slice(0, 4).map((song, index) => (
                          <div key={song.id} className="overflow-hidden">
                            <img
                              src={song.albumCover}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {Array.from({ length: Math.max(0, 4 - playlist.songs.length) }).map((_, index) => (
                          <div 
                            key={`empty-${index}`} 
                            className="bg-gradient-to-br from-purple-500/30 to-indigo-500/30"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                        <ListMusic size={20} className="text-white/70" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-white transition-colors">{playlist.name}</h3>
                    <p className="text-sm text-white/50">
                      {playlist.songs ? playlist.songs.length : 0} {playlist.songs && playlist.songs.length === 1 ? 'song' : 'songs'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 glass-card">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                <ListMusic size={24} className="text-white/70" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">No playlists created yet</h3>
              <p className="text-white/70 max-w-md mx-auto mb-6">
                Create your first playlist to organize your favorite songs
              </p>
              <Link to="/playlists">
                <Button 
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0"
                >
                  Create Your First Playlist
                </Button>
              </Link>
            </div>
          )}
        </section>
        
        {/* About Deezer integration */}
        <section className="p-6 rounded-xl bg-gradient-to-r from-black/40 to-black/60 border border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Disc size={40} className="text-white" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-display font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Powered by Deezer API
              </h2>
              <p className="text-white/70 mb-4">
                Enjoy millions of tracks, artists, and playlists from Deezer's vast music catalog. 
                This streaming experience brings you the latest and most popular music directly through 
                Deezer's extensive library.
              </p>
              <Button 
                variant="outline"
                className="bg-white/5 text-white border-white/10 hover:bg-white/10"
                onClick={() => window.open("https://developers.deezer.com/", "_blank")}
              >
                Learn More About Deezer API
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
