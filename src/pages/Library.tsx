
import React, { useState, useEffect } from "react";
import { useMusic } from "@/contexts/MusicContext";
import SongCard, { SongCardSkeleton } from "@/components/SongCard";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, List, Grid, Calendar, Clock, Headphones, LayoutGrid } from "lucide-react";
import PlaylistCard from "@/components/PlaylistCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Library = () => {
  const { 
    songs, 
    playlists, 
    recentlyPlayed,
    isLoading,
    searchSongs, 
    createPlaylist 
  } = useMusic();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentTab, setCurrentTab] = useState("all");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Handle search
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
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle create playlist
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl opacity-30" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/10 backdrop-blur-sm border border-white/5">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Your Library</h1>
            <p className="text-muted-foreground">
              Browse your personal music collection, playlists, and recently played tracks
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center">
                  <Plus size={16} className="mr-2" />
                  New Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="playlist-name">Playlist name</Label>
                    <Input
                      id="playlist-name"
                      placeholder="My awesome playlist"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreatePlaylist}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="border border-border rounded-md flex overflow-hidden bg-card/80">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search section */}
      <div className="mb-8">
        <SearchInput 
          placeholder="Search for songs, artists, albums..." 
          onSearch={handleSearch}
          className="w-full max-w-3xl mx-auto"
        />
      </div>

      {/* Tabs and content */}
      {isSearching ? (
        <div className="animate-fade-in">
          <h2 className="text-xl font-display font-semibold mb-4">Search Results</h2>
          
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
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                <Headphones size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-medium mb-2">No songs found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try searching for another song, artist, or album
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? 
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
              "space-y-2 bg-card/50 rounded-xl overflow-hidden border border-border p-3"
            }>
              {searchResults.map((song) => (
                <SongCard key={song.id} song={song} variant={viewMode} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-8 bg-card/50 p-1">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <LayoutGrid size={16} />
              <span className="md:inline hidden">All Songs</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center gap-2">
              <List size={16} />
              <span className="md:inline hidden">Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock size={16} />
              <span className="md:inline hidden">Recently Played</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">All Songs</h2>
              <div className="text-sm text-muted-foreground">
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </div>
            </div>
            
            {isLoading ? (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2"
              }>
                {Array(12).fill(0).map((_, i) => (
                  <SongCardSkeleton key={i} variant={viewMode} />
                ))}
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <Headphones size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-medium mb-2">Your library is empty</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Start searching for songs to build your collection
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2 bg-card/50 rounded-xl overflow-hidden border border-border p-3"
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
          
          <TabsContent value="playlists" className="mt-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">Your Playlists</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    New Playlist
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new playlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="playlist-name">Playlist name</Label>
                      <Input
                        id="playlist-name"
                        placeholder="My awesome playlist"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleCreatePlaylist}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="aspect-square" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <List size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-medium mb-2">No playlists yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Create your first playlist to organize your favorite songs
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={16} className="mr-2" />
                      Create your first playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create new playlist</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="playlist-name">Playlist name</Label>
                        <Input
                          id="playlist-name"
                          placeholder="My awesome playlist"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleCreatePlaylist}>Create</Button>
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
              <h2 className="text-xl font-display font-semibold">Recently Played</h2>
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Calendar size={14} />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2"
              }>
                {Array(8).fill(0).map((_, i) => (
                  <SongCardSkeleton key={i} variant={viewMode} />
                ))}
              </div>
            ) : recentlyPlayed.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <Clock size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-medium mb-2">No recent activity</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start playing songs to build your history
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? 
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
                "space-y-2 bg-card/50 rounded-xl overflow-hidden border border-border p-3"
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
