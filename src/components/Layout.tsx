import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { Home, Library, Users, MessageSquare, ListMusic, LayoutGrid, Menu, X, Search, Music2, Disc3, Mic2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MusicPlayer from "./MusicPlayer";
import { useMusic } from "@/contexts/MusicContext";
import SearchInput from "@/components/SearchInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentSong, songs, searchSongs } = useMusic();
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/landing");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchSongs(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const navItems = [
    { 
      name: "Home", 
      path: "/", 
      icon: Home,
      description: "Discover new music"
    },
    { 
      name: "Browse", 
      path: "/library", 
      icon: LayoutGrid,
      description: "Explore the library" 
    },
    { 
      name: "Artists", 
      path: "/artists", 
      icon: Mic2,
      description: "Your favorite artists" 
    },
    { 
      name: "Messages", 
      path: "/messages", 
      icon: MessageSquare,
      description: "Connect with friends" 
    },
    { 
      name: "Playlists", 
      path: "/playlists", 
      icon: ListMusic,
      description: "Your custom playlists" 
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Top navigation bar */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 z-40 relative bg-black/40 backdrop-blur-lg">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors mr-3 lg:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Music2 size={16} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Harmony
            </span>
          </Link>
          
          <Link to="/" className="md:hidden flex">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Music2 size={16} className="text-white" />
            </div>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xl px-6">
          <SearchInput 
            placeholder="Search for songs, artists, albums..." 
            onSearch={handleSearch}
            className="w-full bg-white/5 border-white/10"
          />
        </div>
        
        {/* User Profile */}
        <div className="flex items-center">
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
              YU
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - transformed into a side panel */}
        <div
          className={cn(
            "fixed inset-y-16 left-0 z-30 w-64 transition-transform duration-300 ease-in-out bg-black/60 backdrop-blur-lg border-r border-white/10",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:relative lg:translate-x-0 lg:inset-y-0"
          )}
        >
          <ScrollArea className="h-full py-4">
            <div className="px-4 mb-6">
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-3 px-2">
                Main Menu
              </h3>
              <nav>
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10 text-white"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          location.pathname === item.path
                            ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                            : "bg-white/5 text-white/70"
                        )}>
                          <item.icon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-white/50">{item.description}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            
            {/* Your Library Section */}
            <div className="px-4 mb-6">
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-3 px-2">
                Your Library
              </h3>
              <div className="space-y-1">
                <Link 
                  to="/playlists" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/5"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                    <Heart size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Liked Songs</div>
                    <div className="text-xs text-white/50">Your favorites</div>
                  </div>
                </Link>
                
                <Link 
                  to="/playlists" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/5"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                    <Disc3 size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Recent Plays</div>
                    <div className="text-xs text-white/50">Recently played</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Search Results Section - only shows when searching */}
            {isSearching && searchResults.length > 0 && (
              <div className="px-4 mb-6">
                <h3 className="text-xs uppercase tracking-wider text-white/50 mb-3 px-2">
                  Search Results
                </h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {searchResults.slice(0, 5).map((song) => (
                    <Link
                      key={song.id}
                      to={`/library?q=${encodeURIComponent(searchQuery)}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/5"
                    >
                      <div className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden">
                        <img 
                          src={song.albumCover} 
                          alt={song.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{song.title}</div>
                        <div className="text-xs text-white/50 truncate">{song.artist}</div>
                      </div>
                    </Link>
                  ))}
                  
                  {searchResults.length > 5 && (
                    <Link
                      to={`/library?q=${encodeURIComponent(searchQuery)}`}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm">View all {searchResults.length} results</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-black">
          <div className="relative">
            {/* Semi-transparent overlay at the top for visual effect */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
            
            {/* Content container */}
            <div className="px-4 py-6 md:px-8 lg:px-10 max-w-7xl mx-auto pb-24">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Music player */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 transform transition-transform duration-300",
        currentSong ? "translate-y-0" : "translate-y-full",
      )}>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default Layout;
