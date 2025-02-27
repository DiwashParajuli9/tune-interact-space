
import React, { useState } from "react";
import { Play, Pause, Plus, MoreHorizontal } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SongCardProps {
  song: {
    id: string;
    title: string;
    artist: string;
    albumCover: string;
    duration: number;
  };
  variant?: "grid" | "list";
}

const SongCard: React.FC<SongCardProps> = ({ song, variant = "grid" }) => {
  const { currentSong, isPlaying, playSong, pauseSong, playlists, addToPlaylist } = useMusic();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (variant === "list") {
    return (
      <div
        className="group flex items-center p-3 rounded-md hover:bg-secondary/50 transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-10 h-10 rounded overflow-hidden bg-muted relative mr-4 flex-shrink-0">
          <img
            src={song.albumCover}
            alt={song.title}
            className={cn(
              "w-full h-full object-cover transition-opacity",
              isHovered || isCurrentlyPlaying ? "opacity-50" : "opacity-100"
            )}
          />
          {(isHovered || isCurrentlyPlaying) && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center text-primary-foreground bg-primary/60 rounded"
            >
              {isCurrentlyPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{song.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        <div className="ml-4 flex items-center">
          <span className="text-xs text-muted-foreground mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(song.duration)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handlePlayPause}>
                {isCurrentlyPlaying ? "Pause" : "Play"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-between"
                onClick={(e) => e.preventDefault()}
              >
                Add to Playlist
                <Plus size={16} className="ml-2" />
              </DropdownMenuItem>
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist.id}
                  className="pl-8 text-sm"
                  onClick={() => addToPlaylist(playlist.id, song.id)}
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

  return (
    <div
      className="group rounded-xl overflow-hidden bg-card hover-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={song.albumCover}
          alt={song.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
            isHovered || isCurrentlyPlaying ? "opacity-70" : "opacity-100"
          )}
        />
        {(isHovered || isCurrentlyPlaying) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors transform hover:scale-105"
            >
              {isCurrentlyPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        )}
        {isHovered && (
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
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onClick={(e) => e.preventDefault()}
                >
                  Add to Playlist
                  <Plus size={16} className="ml-2" />
                </DropdownMenuItem>
                {playlists.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    className="pl-8 text-sm"
                    onClick={() => addToPlaylist(playlist.id, song.id)}
                  >
                    {playlist.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
