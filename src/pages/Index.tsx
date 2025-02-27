
import React, { useState } from "react";
import { useMusic } from "@/contexts/MusicContext";
import SongCard from "@/components/SongCard";
import ArtistCard from "@/components/ArtistCard";
import { ListMusic, Users, Heart, Disc3 } from "lucide-react";
import { Link } from "react-router-dom";
import SearchInput from "@/components/SearchInput";

const Home = () => {
  const { songs, artists, playSong } = useMusic();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get featured content (first 6 songs and artists)
  const featuredSongs = songs.slice(0, 6);
  const featuredArtists = artists.slice(0, 6);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    
    // Search in songs
    const matchingSongs = songs.filter(
      song => song.title.toLowerCase().includes(lowerQuery) || 
              song.artist.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);
    
    // Search in artists
    const matchingArtists = artists.filter(
      artist => artist.name.toLowerCase().includes(lowerQuery) || 
                artist.genre.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);
    
    setSearchResults([
      ...matchingSongs.map(item => ({ ...item, type: 'song' })),
      ...matchingArtists.map(item => ({ ...item, type: 'artist' }))
    ]);
  };

  return (
    <div className="pb-20">
      {/* Hero section */}
      <div className="relative h-80 mb-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center px-8 lg:px-12">
          <div className="max-w-xl">
            <div className="inline-block mb-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white">
              Welcome to Harmony
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Discover, Listen, Connect
            </h1>
            <p className="text-white/80 mb-6 max-w-md">
              Your personal music space where you can explore new tracks, connect with other music 
              lovers, and build your personal collection.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => playSong(songs[0])}
                className="bg-white text-primary font-medium py-2 px-4 rounded-lg hover:bg-white/90 transition-colors"
              >
                Start Listening
              </button>
              <Link
                to="/messages"
                className="bg-white/20 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
              >
                Connect with Others
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchInput 
          placeholder="Search for songs, artists..." 
          onSearch={handleSearch}
          className="max-w-2xl mx-auto"
        />
        
        {/* Search results */}
        {isSearching && (
          <div className="mt-4 max-w-2xl mx-auto glass p-4 rounded-xl animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Search Results</h3>
            
            {searchResults.length === 0 ? (
              <p className="text-muted-foreground text-sm">No results found</p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <div 
                    key={`${result.type}-${result.id}`}
                    className="flex items-center p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden bg-muted mr-3">
                      <img
                        src={result.type === 'song' ? result.albumCover : result.image}
                        alt={result.type === 'song' ? result.title : result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        {result.type === 'song' ? result.title : result.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center">
                        {result.type === 'song' ? (
                          <>
                            <Disc3 size={12} className="mr-1" />
                            {result.artist}
                          </>
                        ) : (
                          <>
                            <Users size={12} className="mr-1" />
                            {result.genre}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {result.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* For You Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold">For You</h2>
          <Link
            to="/library"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {featuredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Artists Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold">Popular Artists</h2>
          <Link
            to="/artists"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl font-display font-semibold mb-6">Explore Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link to="/library" className="group">
            <div className="glass p-6 rounded-xl hover-card h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ListMusic className="text-primary" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">Music Library</h3>
              <p className="text-muted-foreground text-sm">
                Access your favorite tracks and discover new music all in one place.
              </p>
            </div>
          </Link>
          
          <Link to="/artists" className="group">
            <div className="glass p-6 rounded-xl hover-card h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="text-primary" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">Artist Profiles</h3>
              <p className="text-muted-foreground text-sm">
                Explore artists from around the world and dive deep into their discographies.
              </p>
            </div>
          </Link>
          
          <Link to="/messages" className="group">
            <div className="glass p-6 rounded-xl hover-card h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Heart className="text-primary" />
              </div>
              <h3 className="text-lg font-display font-medium mb-2">Connect & Share</h3>
              <p className="text-muted-foreground text-sm">
                Interact with other music lovers, share recommendations, and discuss your favorite tracks.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
