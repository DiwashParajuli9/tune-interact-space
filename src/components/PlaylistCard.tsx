
import React from "react";
import { PlaySquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    songs: any[];
    createdAt: Date;
  };
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  // Format the date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get a different color for each playlist
  const getBackgroundColor = (id: string): string => {
    const colors = [
      "from-indigo-500 to-purple-500",
      "from-rose-500 to-orange-500",
      "from-emerald-500 to-teal-500",
      "from-cyan-500 to-blue-500",
      "from-fuchsia-500 to-pink-500",
    ];
    
    // Use the playlist id to determine the color
    const index = Math.abs(
      id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % colors.length;
    
    return colors[index];
  };

  return (
    <div className="group rounded-xl overflow-hidden hover-card">
      <div className="aspect-square relative overflow-hidden">
        {playlist.songs.length > 0 ? (
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
            {playlist.songs.slice(0, 4).map((song, index) => (
              <div key={song.id} className="overflow-hidden">
                <img
                  src={song.albumCover}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Fill with gradient if less than 4 songs */}
            {Array.from({ length: Math.max(0, 4 - playlist.songs.length) }).map((_, index) => (
              <div 
                key={`empty-${index}`} 
                className={cn(
                  "bg-gradient-to-br", 
                  getBackgroundColor(playlist.id)
                )}
              ></div>
            ))}
          </div>
        ) : (
          <div className={cn(
            "w-full h-full bg-gradient-to-br flex items-center justify-center",
            getBackgroundColor(playlist.id)
          )}>
            <PlaySquare size={48} className="text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
          <div className="p-4 w-full">
            <div className="text-xs text-white/80 font-medium">
              {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{playlist.name}</h3>
        <p className="text-xs text-muted-foreground">
          Created {formatDate(playlist.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
