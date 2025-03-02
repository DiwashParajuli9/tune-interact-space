
import React, { useState, useEffect } from "react";
import { useMusic } from "@/contexts/MusicContext";
import ArtistCard from "@/components/ArtistCard";
import SearchInput from "@/components/SearchInput";
import { List, Grid, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongCard from "@/components/SongCard";
import * as api from "@/lib/api";
import { toast } from "sonner";

const Artists = () => {
  const { artists: contextArtists, songs, searchArtists } = useMusic();
  const [artists, setArtists] = useState<any[]>(contextArtists || []);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial artists data
  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        // Fetch some initial artists using search
        const initialGenres = ["pop", "rock", "hip hop", "electronic"];
        const randomGenre = initialGenres[Math.floor(Math.random() * initialGenres.length)];
        const results = await api.searchArtists(randomGenre);
        
        if (results && results.length > 0) {
          setArtists(results);
        } else if (contextArtists && contextArtists.length > 0) {
          setArtists(contextArtists);
        } else {
          // Fall back to sample data
          setArtists([
            {
              id: "101",
              name: "The Weeknd",
              image: "https://e-cdns-images.dzcdn.net/images/artist/033c9b675d5c42c4695bf9c5acfb4119/500x500-000000-80-0-0.jpg",
              genre: "R&B, Pop",
              bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer."
            },
            {
              id: "102",
              name: "Ed Sheeran",
              image: "https://e-cdns-images.dzcdn.net/images/artist/0692e35f2801d3d44f05c69b67b83b3d/500x500-000000-80-0-0.jpg",
              genre: "Pop, Folk-Pop",
              bio: "Edward Christopher Sheeran MBE is an English singer, songwriter, musician, record producer, and actor."
            },
            {
              id: "103",
              name: "Billie Eilish",
              image: "https://e-cdns-images.dzcdn.net/images/artist/8b6e3f73d9a246c8e50e3fde7462fa6a/500x500-000000-80-0-0.jpg",
              genre: "Pop, Electropop",
              bio: "Billie Eilish Pirate Baird O'Connell is an American singer and songwriter."
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast.error("Failed to load artists, showing samples");
        // Fallback to sample data
        setArtists([
          {
            id: "101",
            name: "The Weeknd",
            image: "https://e-cdns-images.dzcdn.net/images/artist/033c9b675d5c42c4695bf9c5acfb4119/500x500-000000-80-0-0.jpg",
            genre: "R&B, Pop",
            bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer."
          },
          {
            id: "102",
            name: "Ed Sheeran",
            image: "https://e-cdns-images.dzcdn.net/images/artist/0692e35f2801d3d44f05c69b67b83b3d/500x500-000000-80-0-0.jpg",
            genre: "Pop, Folk-Pop",
            bio: "Edward Christopher Sheeran MBE is an English singer, songwriter, musician, record producer, and actor."
          },
          {
            id: "103",
            name: "Billie Eilish",
            image: "https://e-cdns-images.dzcdn.net/images/artist/8b6e3f73d9a246c8e50e3fde7462fa6a/500x500-000000-80-0-0.jpg",
            genre: "Pop, Electropop",
            bio: "Billie Eilish Pirate Baird O'Connell is an American singer and songwriter."
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [contextArtists]);

  // Filter songs by artist
  const getArtistSongs = (artistName: string) => {
    return songs.filter(song => song.artist === artistName);
  };

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    
    try {
      // Now properly await the Promise returned by searchArtists
      const results = await searchArtists(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for artists:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
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
          {isLoading ? (
            <p className="text-muted-foreground">Searching...</p>
          ) : searchResults.length === 0 ? (
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
          {isLoading ? (
            <p className="text-muted-foreground">Loading artists...</p>
          ) : artists.length === 0 ? (
            <p className="text-muted-foreground">No artists available</p>
          ) : (
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
          )}
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
