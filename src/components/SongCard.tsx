
import React, { useState } from "react";
import { Play, Pause, Plus, Heart, MoreHorizontal, Music } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface SongCardProps {
  song: {
    id: string;
    title: string;
    artist: string;
    albumCover: string;
    audioSrc: string;
    duration: number;
    artistId?: string;
    albumId?: string;
  };
  variant?: "grid" | "list" | "compact";
  index?: number;
  showIndex?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  variant = "grid", 
  index, 
  showIndex = false 
}) => {
  const { currentSong, isPlaying, playSong, pauseSong, playlists, addToPlaylist } = useMusic();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // Add to favorites playlist
    if (!isFavorited) {
      const favoritesPlaylist = playlists.find(p => p.name === "Favorites");
      if (favoritesPlaylist) {
        addToPlaylist(favoritesPlaylist.id, song.id);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (variant === "compact") {
    return (
      <div
        className="group flex items-center p-2 rounded-md hover:bg-secondary/30 transition-colors cursor-pointer"
        onClick={() => playSong(song)}
      >
        <div className="w-8 h-8 rounded overflow-hidden bg-muted relative mr-3 flex-shrink-0">
          {song.albumCover ? (
            <img
              src={song.albumCover}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <Music size={14} className="text-primary/60" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium truncate">{song.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePlayPause}
            className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          >
            {isCurrentlyPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div
        className="group flex items-center p-3 rounded-md hover:bg-secondary/50 transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => playSong(song)}
      >
        {showIndex && index !== undefined ? (
          <div 
            className={cn(
              "w-8 flex-shrink-0 text-center text-sm font-medium",
              isCurrentlyPlaying ? "text-primary" : "text-muted-foreground",
              (isHovered || isCurrentlyPlaying) ? "opacity-0" : "opacity-100"
            )}
          >
            {index + 1}
          </div>
        ) : (
          <div className="w-8 flex-shrink-0" />
        )}
        
        <div className="w-10 h-10 rounded overflow-hidden bg-muted relative mr-4 flex-shrink-0">
          {song.albumCover ? (
            <img
              src={song.albumCover}
              alt={song.title}
              className={cn(
                "w-full h-full object-cover transition-opacity",
                isHovered || isCurrentlyPlaying ? "opacity-60" : "opacity-100"
              )}
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <Music size={16} className="text-primary/60" />
            </div>
          )}
          
          {(isHovered || isCurrentlyPlaying) && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center text-primary-foreground bg-primary/40 rounded"
            >
              {isCurrentlyPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-sm font-medium truncate",
            isCurrentlyPlaying && "text-primary"
          )}>
            {song.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        
        <div className="ml-4 flex items-center space-x-2">
          <span className="text-xs text-muted-foreground w-12 text-right">
            {formatTime(song.duration)}
          </span>
          
          <button 
            onClick={handleAddToFavorites}
            className={cn(
              "p-2 rounded-full",
              isFavorited ? "text-red-500" : "text-muted-foreground hover:text-foreground",
              !isHovered && !isFavorited && "opacity-0 group-hover:opacity-100",
              "transition-opacity"
            )}
          >
            <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handlePlayPause}>
                {isCurrentlyPlaying ? "Pause" : "Play"} "{song.title}"
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddToFavorites}>
                {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs text-muted-foreground"
                onClick={(e) => e.preventDefault()}
              >
                Add to Playlist
              </DropdownMenuItem>
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist.id}
                  className="pl-8 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToPlaylist(playlist.id, song.id);
                  }}
                >
                  {playlist.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className="group rounded-xl overflow-hidden bg-card hover-card cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => playSong(song)}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        {song.albumCover ? (
          <img
            src={song.albumCover}
            alt={song.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
              isHovered || isCurrentlyPlaying ? "opacity-70" : "opacity-100"
            )}
          />
        ) : (
          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
            <Music size={32} className="text-primary/60" />
          </div>
        )}
        
        {(isHovered || isCurrentlyPlaying) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors transform hover:scale-105 shadow-lg"
            >
              {isCurrentlyPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        )}
        
        {isHovered && (
          <>
            <button
              onClick={handleAddToFavorites}
              className={cn(
                "absolute top-2 left-2 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors",
                isFavorited && "text-red-500"
              )}
            >
              <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
            </button>
            
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handlePlayPause}>
                    {isCurrentlyPlaying ? "Pause" : "Play"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddToFavorites}>
                    {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs text-muted-foreground"
                    onClick={(e) => e.preventDefault()}
                  >
                    Add to Playlist
                  </DropdownMenuItem>
                  {playlists.map((playlist) => (
                    <DropdownMenuItem
                      key={playlist.id}
                      className="pl-8 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlaylist(playlist.id, song.id);
                      }}
                    >
                      {playlist.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
        
        {isCurrentlyPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary">
            <div className="h-full bg-white/70 animate-progress"></div>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className={cn(
          "font-medium text-sm truncate",
          isCurrentlyPlaying && "text-primary"
        )}>
          {song.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>
    </div>
  );
};

export function SongCardSkeleton({ variant = "grid" }: { variant?: "grid" | "list" | "compact" }) {
  if (variant === "compact") {
    return (
      <div className="flex items-center p-2">
        <Skeleton className="w-8 h-8 rounded mr-3 flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-3 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }
  
  if (variant === "list") {
    return (
      <div className="flex items-center p-3">
        <Skeleton className="w-8 h-4 mr-2" />
        <Skeleton className="w-10 h-10 rounded mr-4 flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-20 h-8 rounded ml-4" />
      </div>
    );
  }
  
  return (
    <div>
      <Skeleton className="aspect-square rounded-xl" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export default SongCard;
