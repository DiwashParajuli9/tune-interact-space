
import React, { useState } from "react";
import { useMusic } from "@/contexts/MusicContext";
import ArtistCard from "@/components/ArtistCard";
import SearchInput from "@/components/SearchInput";
import { List, Grid, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongCard from "@/components/SongCard";

const Artists = () => {
  const { artists, songs, searchArtists } = useMusic();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter songs by artist
  const getArtistSongs = (artistName: string) => {
    return songs.filter(song => song.artist === artistName);
  };

  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = searchArtists(query);
    setSearchResults(results);
  };

  // Open artist dialog
  const openArtistDialog = (artist: any) => {
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Artists</h1>
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

      <div className="mb-8">
        <SearchInput 
          placeholder="Search artists..." 
          onSearch={handleSearch}
        />
      </div>

      {isSearching ? (
        <div className="animate-fade-in">
          <h2 className="text-xl font-display font-semibold mb-4">Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="text-muted-foreground">No artists found</p>
          ) : (
            <div className={viewMode === "grid" ? 
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
              "space-y-2 bg-card rounded-xl overflow-hidden border border-border p-2"
            }>
              {searchResults.map((artist) => (
                <div 
                  key={artist.id} 
                  onClick={() => openArtistDialog(artist)}
                  className="cursor-pointer"
                >
                  <ArtistCard artist={artist} variant={viewMode} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-display font-semibold mb-4">All Artists</h2>
          <div className={viewMode === "grid" ? 
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" : 
            "space-y-2 bg-card rounded-xl overflow-hidden border border-border p-2"
          }>
            {artists.map((artist) => (
              <div 
                key={artist.id}
                onClick={() => openArtistDialog(artist)}
                className="cursor-pointer"
              >
                <ArtistCard artist={artist} variant={viewMode} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artist Detail Dialog */}
      {selectedArtist && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedArtist.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogOpen(false)}
                >
                  <X size={18} />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="md:col-span-1">
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={selectedArtist.image}
                    alt={selectedArtist.name}
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-display font-medium mb-1">{selectedArtist.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedArtist.genre}</p>
                  <div className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full inline-block">
                    {getArtistSongs(selectedArtist.name).length} songs
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <Tabs defaultValue="about">
                  <TabsList className="mb-4">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="songs">Songs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="space-y-4">
                    <p className="text-muted-foreground">{selectedArtist.bio}</p>
                    <div className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Genre</h4>
                      <div className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full inline-block">
                        {selectedArtist.genre}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="songs">
                    <div className="space-y-2">
                      {getArtistSongs(selectedArtist.name).length > 0 ? (
                        getArtistSongs(selectedArtist.name).map((song) => (
                          <SongCard key={song.id} song={song} variant="list" />
                        ))
                      ) : (
                        <p className="text-muted-foreground">No songs available</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Artists;
