
import React, { useState } from "react";
import { useMusic } from "@/contexts/MusicContext";
import SongCard from "@/components/SongCard";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Plus, List, Grid } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Library = () => {
  const { songs, searchSongs, createPlaylist } = useMusic();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = searchSongs(query);
    setSearchResults(results);
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
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Your Library</h1>
        <div className="flex items-center space-x-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
          
          <div className="border border-border rounded-md flex overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background"
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <SearchInput 
          placeholder="Search in your library..." 
          onSearch={handleSearch}
        />
      </div>

      {isSearching ? (
        <div className="animate-fade-in">
          <h2 className="text-xl font-display font-semibold mb-4">Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="text-muted-foreground">No songs found</p>
          ) : (
            <div className={viewMode === "grid" ? 
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
              "space-y-2"
            }>
              {searchResults.map((song) => (
                <SongCard key={song.id} song={song} variant={viewMode} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-display font-semibold mb-4">All Songs</h2>
          <div className={viewMode === "grid" ? 
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
            "space-y-2 bg-card rounded-xl overflow-hidden border border-border p-2"
          }>
            {songs.map((song) => (
              <SongCard key={song.id} song={song} variant={viewMode} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
