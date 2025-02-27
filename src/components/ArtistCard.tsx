
import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    image: string;
    genre: string;
    bio?: string;
  };
  variant?: "grid" | "list";
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, variant = "grid" }) => {
  if (variant === "list") {
    return (
      <div className="group flex items-center p-3 rounded-md hover:bg-secondary/50 transition-colors">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted mr-4 flex-shrink-0">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium">{artist.name}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-2">{artist.genre}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl overflow-hidden hover-card">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
          <div className="p-4 w-full">
            <div className="text-xs text-white/80 font-medium bg-white/20 backdrop-blur-sm py-1 px-2 rounded-full inline-flex items-center">
              <Users size={12} className="mr-1" />
              {artist.genre}
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{artist.name}</h3>
        <p className="text-xs text-muted-foreground">{artist.genre}</p>
      </div>
    </div>
  );
};

export default ArtistCard;
