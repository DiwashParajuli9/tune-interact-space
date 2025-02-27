
import React from "react";
import { PlaySquare, Play, Pause, Music, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMusic } from "@/contexts/MusicContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongCard from "@/components/SongCard";

interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    songs: any[];
    createdAt: Date;
    cover?: string;
  };
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const { playSong, currentSong, isPlaying } = useMusic();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  // Check if a song from this playlist is currently playing
  const isPlayingFromPlaylist = React.useMemo(() => {
    if (!currentSong || !isPlaying) return false;
    return playlist.songs.some(song => song.id === currentSong.id);
  }, [currentSong, isPlaying, playlist.songs]);

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
      "from-red-500 to-yellow-500",
      "from-blue-500 to-green-500",
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-amber-500",
      "from-teal-500 to-cyan-500",
    ];
    
    // Use the playlist id to determine the color
    const index = Math.abs(
      id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % colors.length;
    
    return colors[index];
  };

  // Play the first song in the playlist
  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };

  return (
    <>
      <div 
        className="group rounded-xl overflow-hidden hover-card cursor-pointer transition-all"
        onClick={() => setIsDialogOpen(true)}
      >
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
              <ListMusic size={48} className="text-white/80" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
            <div className="text-xs text-white/90 font-medium backdrop-blur-sm bg-white/10 py-1 px-2 rounded-md">
              {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
            </div>
            
            {playlist.songs.length > 0 && (
              <button
                onClick={handlePlayPlaylist}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
              >
                {isPlayingFromPlaylist ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
          </div>
          
          {isPlayingFromPlaylist && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Music size={12} className="text-primary-foreground animate-pulse" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm">{playlist.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Created {formatDate(playlist.createdAt)}</span>
          </p>
        </div>
      </div>
      
      {/* Playlist details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{playlist.name}</span>
              {isPlayingFromPlaylist && (
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full animate-pulse">
                  Now Playing
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="aspect-square md:col-span-1 rounded-xl overflow-hidden">
                {playlist.songs.length > 0 ? (
                  <div className="grid grid-cols-2 grid-rows-2 h-full w-full shadow-lg">
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
                    <ListMusic size={48} className="text-white/80" />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created on {new Date(playlist.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                {playlist.songs.length > 0 && (
                  <div className="mt-auto">
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() => {
                        if (playlist.songs.length > 0) {
                          playSong(playlist.songs[0]);
                        }
                      }}
                    >
                      <Play size={16} className="mr-2" />
                      Play All
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="songs">
              <TabsList className="mb-4">
                <TabsTrigger value="songs">Songs</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="songs">
                {playlist.songs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                      <Music size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-medium mb-2">No songs in this playlist</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Add songs to this playlist to start listening
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 rounded-xl overflow-hidden bg-card/50 border border-border p-2">
                    {playlist.songs.map((song, index) => (
                      <SongCard 
                        key={`${song.id}-${index}`} 
                        song={song} 
                        variant="list" 
                        index={index}
                        showIndex={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details">
                <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Playlist Name</h4>
                    <p>{playlist.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Created</h4>
                    <p className="text-muted-foreground">
                      {new Date(playlist.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Songs</h4>
                    <p className="text-muted-foreground">
                      {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                    </p>
                  </div>
                  {playlist.songs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Total Duration</h4>
                      <p className="text-muted-foreground">
                        {(() => {
                          const totalSeconds = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
                          const hours = Math.floor(totalSeconds / 3600);
                          const minutes = Math.floor((totalSeconds % 3600) / 60);
                          const seconds = totalSeconds % 60;
                          return `${hours ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaylistCard;
