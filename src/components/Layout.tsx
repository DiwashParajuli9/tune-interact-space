
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Home, Library, Users, MessageSquare, ListMusic, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MusicPlayer from "./MusicPlayer";
import { useMusic } from "@/contexts/MusicContext";

const Layout: React.FC = () => {
  const location = useLocation();
  const { currentSong } = useMusic();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Close sidebar on mobile when changing routes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Library", path: "/library", icon: Library },
    { name: "Artists", path: "/artists", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Playlists", path: "/playlists", icon: ListMusic },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm border border-border lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-sidebar border-r border-border lg:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-border">
            <Link to="/" className="text-2xl font-display font-bold tracking-tight">
              Harmony
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pt-6 pb-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-lg transition-colors",
                      location.pathname === item.path
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon size={18} className="mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-xs font-medium">You</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Your Account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24">
          <div className="page-enter max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Music player */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 transform transition-transform duration-300",
          currentSong ? "translate-y-0" : "translate-y-full",
          sidebarOpen ? "lg:ml-64" : ""
        )}>
          <MusicPlayer />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
