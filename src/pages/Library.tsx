import React, { useState, useEffect } from "react";
import { useMusic } from "@/contexts/MusicContext";
import SongCard, { SongCardSkeleton } from "@/components/SongCard";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, List, Grid, Calendar, Clock, Headphones, LayoutGrid, RefreshCw, Music } from "lucide-react";
import PlaylistCard from "@/components/PlaylistCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";
import { toast } from "sonner";

const GRADIENT_CLASSES = [
  "from-rose-500 to-orange-500",
  "from-indigo-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-pink-500",
  "from-amber-500 to-yellow-500",
  "from-violet-500 to-indigo-500",
  "from-sky-500 to-blue-500",
];

const Library = () => {
  const { 
    songs, 
    playlists, 
    recentlyPlayed,
    isLoading: contextLoading,
    searchSongs, 
    createPlaylist,
    playSong
  } = useMusic();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentTab, setCurrentTab] = useState("all");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [trendingTracks, setTrendingTracks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      try {
        setLocalLoading(true);
        const chartTracks = await api.getChartTracks(20);
        setTrendingTracks(chartTracks);
      } catch (error) {
        console.error("Failed to fetch trending tracks:", error);
        toast.error("Failed to load trending tracks");
      } finally {
        setLocalLoading(false);
      }
    };

    fetchTrendingTracks();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLocalLoading(true);
    
    try {
      const results = await searchSongs(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setDialogOpen(false);
      toast.success(`Created playlist: ${newPlaylistName}`);
    }
  };

  const refreshTrending = async () => {
    setRefreshing(true);
    try {
      const chartTracks = await api.getChartTracks(20);
      setTrendingTracks(chartTracks);
      toast.success("Refreshed trending tracks");
    } catch (error) {
      console.error("Failed to refresh trending tracks:", error);
      toast.error("Failed to refresh trending tracks");
    } finally {
      setRefreshing(false);
    }
  };

  const getRandomGradient = () => {
    return GRADIENT_CLASSES[Math.floor(Math.random() * GRADIENT_CLASSES.length)];
  };

  const handleSongClick = (song: any) => {
    if (song) {
      playSong(song);
    }
  };

  return (
    <div className="pb-24">
      <div className="relative mb-8 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${getRandomGradient()} rounded-xl opacity-30`} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-xl backdrop-blur-sm border border-white/5">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 text-gradient bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Your Library</h1>
            <p className="text-muted-foreground">
              Browse your personal music collection, playlists, and trending tracks
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                  <Plus size={16} className="mr-2" />
                  New Playlist
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-lg bg-black/70 border border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-gradient bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Create new playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="playlist-name" className="text-white/90">Playlist name</Label>
                    <Input
                      id="playlist-name"
                      placeholder="My awesome playlist"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleCreatePlaylist}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                  >
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="border border-white/20 rounded-md flex overflow-hidden bg-black/30 backdrop-blur-md">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid" 
                    ? "bg-white/20 text-white" 
                    : "bg-transparent text-white/60 hover:text-white"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list" 
                    ? "bg-white/20 text-white" 
                    : "bg-transparent text-white/60 hover:text-white"
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <SearchInput 
          placeholder="Search for songs, artists, albums..." 
          onSearch={handleSearch}
          className="w-full max-w-3xl mx-auto backdrop-blur-md bg-white/5 border border-white/10"
        />
      </div>

      {isSearching ? (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gradient bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Search Results</h2>
          </div>
          
          {localLoading ? (
            <div className={viewMode === "grid" ? 
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
              "space-y-2"
            }>
              {Array(8).fill(0).map((_, i) => (
                <SongCardSkeleton key={i} variant={viewMode} />
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto flex items-center justify-center mb-4">
                <Headphones size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-display font-medium mb-2 text-white">No songs found</h3>
              <p className="text-white/70 max-w-md mx-auto">
                Try searching for another song, artist, or album
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? 
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
              "space-y-2 backdrop-blur-lg bg-black/20 rounded-xl overflow-hidden border border-white/10 p-3"
            }>
              {searchResults.map((song) => (
                <div key={song.id} onClick={() => handleSongClick(song)} className="cursor-pointer">
                  <SongCard song={song} variant={viewMode} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="backdrop-blur-sm">
          <TabsList className="mb-8 backdrop-blur-lg bg-black/30 p-1 border border-white/10">
            <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <LayoutGrid size={16} />
              <span className="md:inline hidden">All Songs</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Music size={16} />
              <span className="md:inline hidden">Trending</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <List size={16} />
              <span className="md:inline hidden">Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Clock size={16} />
              <span className="md:inline hidden">Recently Played</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gradient bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">All Songs</h2>
              <div className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </div>
            </div>
            
            {contextLoading ? (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2"
              }>
                {Array(12).fill(0).map((_, i) => (
                  <SongCardSkeleton key={i} variant={viewMode} />
                ))}
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center py-12 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto flex items-center justify-center mb-4">
                  <Headphones size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-display font-medium mb-2 text-white">Your library is empty</h3>
                <p className="text-white/70 max-w-md mx-auto mb-6">
                  Start searching for songs to build your collection
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2 backdrop-blur-lg bg-black/20 rounded-xl overflow-hidden border border-white/10 p-3"
              }>
                {songs.map((song, index) => (
                  <SongCard 
                    key={song.id} 
                    song={song} 
                    variant={viewMode} 
                    index={index}
                    showIndex={viewMode === "list"} 
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="mt-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gradient bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent">Trending Now</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshTrending}
                disabled={refreshing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw size={14} className={cn("mr-2", refreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>
            
            {localLoading ? (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2"
              }>
                {Array(12).fill(0).map((_, i) => (
                  <SongCardSkeleton key={i} variant={viewMode} />
                ))}
              </div>
            ) : trendingTracks.length === 0 ? (
              <div className="text-center py-12 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 mx-auto flex items-center justify-center mb-4">
                  <Music size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-display font-medium mb-2 text-white">Couldn't load trending tracks</h3>
                <p className="text-white/70 max-w-md mx-auto mb-6">
                  Please try refreshing the data
                </p>
                <Button 
                  onClick={refreshTrending}
                  disabled={refreshing}
                  className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border-0"
                >
                  <RefreshCw size={16} className={cn("mr-2", refreshing && "animate-spin")} />
                  Refresh Data
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center py-2 px-4 mb-4 rounded-lg backdrop-blur-lg bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-white/10">
                  <p className="text-white/80 text-sm">
                    <span className="font-medium">Pro tip:</span> Click on any song to play it instantly
                  </p>
                </div>
                <div className={viewMode === "grid" ? 
                  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                  "space-y-2 backdrop-blur-lg bg-black/20 rounded-xl overflow-hidden border border-white/10 p-3"
                }>
                  {trendingTracks.map((song, index) => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      variant={viewMode} 
                      index={index}
                      showIndex={viewMode === "list"} 
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="playlists" className="mt-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gradient bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">Your Playlists</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus size={16} className="mr-2" />
                    New Playlist
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-lg bg-black/70 border border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-gradient bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Create new playlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="playlist-name" className="text-white/90">Playlist name</Label>
                      <Input
                        id="playlist-name"
                        placeholder="My awesome playlist"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <Button 
                      onClick={handleCreatePlaylist}
                      className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-0"
                    >
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {contextLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden backdrop-blur-md bg-black/40 border border-white/10">
                    <Skeleton className="aspect-square bg-white/10" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-white/10" />
                      <Skeleton className="h-3 w-1/2 bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-12 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 mx-auto flex items-center justify-center mb-4">
                  <List size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-display font-medium mb-2 text-white">No playlists yet</h3>
                <p className="text-white/70 max-w-md mx-auto mb-6">
                  Create your first playlist to organize your favorite songs
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-0">
                      <Plus size={16} className="mr-2" />
                      Create your first playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-lg bg-black/70 border border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-gradient bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Create new playlist</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="playlist-name" className="text-white/90">Playlist name</Label>
                        <Input
                          id="playlist-name"
                          placeholder="My awesome playlist"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <Button 
                        onClick={handleCreatePlaylist}
                        className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-0"
                      >
                        Create
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gradient bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Recently Played</h2>
              <div className="flex items-center text-sm text-white/70 gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar size={14} />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {contextLoading ? (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2"
              }>
                {Array(8).fill(0).map((_, i) => (
                  <SongCardSkeleton key={i} variant={viewMode} />
                ))}
              </div>
            ) : recentlyPlayed.length === 0 ? (
              <div className="text-center py-12 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto flex items-center justify-center mb-4">
                  <Clock size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-display font-medium mb-2 text-white">No recent activity</h3>
                <p className="text-white/70 max-w-md mx-auto">
                  Start playing songs to build your history
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2 backdrop-blur-lg bg-black/20 rounded-xl overflow-hidden border border-white/10 p-3"
              }>
                {recentlyPlayed.map((song, index) => (
                  <SongCard 
                    key={`${song.id}-${index}`} 
                    song={song} 
                    variant={viewMode} 
                    index={index}
                    showIndex={viewMode === "list"} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Library;
