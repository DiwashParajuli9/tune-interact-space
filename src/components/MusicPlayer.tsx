
import React, { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Maximize2, Minimize2, ListMusic, Heart, Shuffle, Repeat 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/contexts/MusicContext";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    pauseSong,
    nextSong,
    prevSong,
    playSong,
    setVolume,
    queue,
    addToPlaylist,
    playlists,
  } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = currentSong
    ? (progress / currentSong.duration) * 100
    : 0;

  // Update visualizer
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newHeights = Array(12)
          .fill(0)
          .map(() => Math.floor(Math.random() * 24) + 4);
        setVisualizerHeights(newHeights);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setVisualizerHeights(Array(12).fill(4));
    }
  }, [isPlaying]);

  // Check if the current song is in favorites
  useEffect(() => {
    if (currentSong) {
      const favPlaylist = playlists.find(p => p.name === "Favorites");
      if (favPlaylist) {
        const isFav = favPlaylist.songs.some(s => s.id === currentSong.id);
        setIsFavorited(isFav);
      }
    }
  }, [currentSong, playlists]);
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentSong || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentageClicked = offsetX / width;
    
    // Set progress based on where user clicked
    const newProgress = Math.floor(percentageClicked * currentSong.duration);
    // In a real app, you would seek the audio to this position
    // For this demo, we'll just update the progress state
    if (currentSong) {
      // This is a mock implementation - in a real app you would seek the audio
      // audioRef.current.currentTime = newProgress;
    }
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!currentSong) return;
    
    const favPlaylist = playlists.find(p => p.name === "Favorites");
    if (favPlaylist) {
      if (isFavorited) {
        // Would remove from favorites in a real implementation
        setIsFavorited(false);
      } else {
        addToPlaylist(favPlaylist.id, currentSong.id);
        setIsFavorited(true);
      }
    }
  };

  if (!currentSong) return null;

  return (
    <div
      className={cn(
        "glass-dark border-t border-border text-foreground transition-all duration-300 ease-in-out overflow-hidden",
        expanded ? "h-96" : "h-20"
      )}
    >
      <div className="container mx-auto h-full">
        {/* Compact player (always visible) */}
        <div className="h-20 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30">
              <img
                src={currentSong.albumCover}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <h4 className="text-sm font-medium truncate">{currentSong.title}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={toggleFavorite}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      isFavorited ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center controls */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShuffle(!shuffle)}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors",
                        shuffle && "text-primary"
                      )}
                    >
                      <Shuffle size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {shuffle ? "Disable Shuffle" : "Enable Shuffle"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={prevSong}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <SkipBack size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Previous</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <button
                onClick={isPlaying ? pauseSong : () => playSong(currentSong)}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors transform hover:scale-105"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={nextSong}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <SkipForward size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Next</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setRepeat(!repeat)}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors",
                        repeat && "text-primary"
                      )}
                    >
                      <Repeat size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {repeat ? "Disable Repeat" : "Enable Repeat"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="w-full mt-1 flex items-center space-x-2 text-xs">
              <span className="text-muted-foreground">
                {formatTime(progress)}
              </span>
              <div 
                className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
                ref={progressBarRef}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <span className="text-muted-foreground">
                {formatTime(currentSong.duration)}
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center justify-end space-x-4 w-1/3">
            <div className="flex items-center space-x-2 pr-2">
              <button
                onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {volume === 0 ? (
                  <VolumeX size={16} />
                ) : volume < 0.5 ? (
                  <Volume1 size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                className="w-20"
                onValueChange={(value) => setVolume(value[0] / 100)}
              />
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowQueue(!showQueue)}
                    className={cn(
                      "text-muted-foreground hover:text-foreground transition-colors",
                      showQueue && expanded && "text-primary"
                    )}
                  >
                    <ListMusic size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {showQueue ? "Hide Queue" : "Show Queue"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {expanded ? "Minimize Player" : "Expand Player"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Expanded player */}
        {expanded && (
          <div className="h-76 p-6 animate-fade-in">
            <div className="flex h-full">
              {/* Album art and visualizer */}
              <div className="w-2/3 pr-8 flex flex-col items-center justify-center">
                <div className="w-64 h-64 rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 mb-8 relative group">
                  <img
                    src={currentSong.albumCover}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h4 className="text-white font-medium">{currentSong.title}</h4>
                      <p className="text-white/80 text-sm">{currentSong.artist}</p>
                    </div>
                  </div>
                  
                  {isPlaying && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center">
                      <span className="block w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    </div>
                  )}
                </div>

                {/* Music visualizer */}
                <div className="visualizer mt-4 gap-1 h-12">
                  {visualizerHeights.map((height, i) => (
                    <div
                      key={i}
                      className="visualizer-bar bg-gradient-to-t from-primary to-primary-foreground/70 rounded-full"
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Song info or queue */}
              <div className="w-1/3 flex flex-col">
                {showQueue ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Up Next</h3>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        {queue.length} songs
                      </span>
                    </div>
                    <div className="overflow-y-auto flex-1 pr-2">
                      {queue.length > 0 ? (
                        <div className="space-y-2 rounded-xl overflow-hidden bg-secondary/20 p-2">
                          {queue.map((song, index) => (
                            <div
                              key={song.id}
                              className="flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer"
                              onClick={() => playSong(song)}
                            >
                              <div className="w-8 h-8 rounded overflow-hidden bg-muted mr-3 flex-shrink-0">
                                <img
                                  src={song.albumCover}
                                  alt={song.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="truncate flex-1">
                                <h4 className="text-sm font-medium truncate">
                                  {song.title}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                  {song.artist}
                                </p>
                              </div>
                              <div className="ml-2 text-xs text-muted-foreground">
                                {formatTime(song.duration)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-secondary/10 rounded-xl">
                          <ListMusic size={32} className="text-muted-foreground mb-2" />
                          <p className="text-muted-foreground text-sm">Queue is empty</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Songs will automatically be added as you listen
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-2">Now Playing</h3>
                    <h2 className="text-3xl font-display font-semibold mb-1">
                      {currentSong.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {currentSong.artist}
                    </p>

                    <div className="flex items-center space-x-4 mb-6">
                      <button 
                        onClick={toggleFavorite}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          isFavorited ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                      </button>
                      
                      <button
                        onClick={() => setShowQueue(true)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2"
                      >
                        <ListMusic size={20} />
                      </button>
                    </div>

                    <div className="bg-secondary/20 p-4 rounded-xl">
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Duration</span>
                          <span className="font-medium">{formatTime(currentSong.duration)}</span>
                        </div>
                      </div>
                      
                      {currentSong.albumId && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Album ID</span>
                            <span className="font-medium">{currentSong.albumId}</span>
                          </div>
                        </div>
                      )}
                      
                      {currentSong.artistId && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Artist ID</span>
                            <span className="font-medium">{currentSong.artistId}</span>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Preview</span>
                          <span className="font-medium">
                            {currentSong.audioSrc ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="text-sm text-muted-foreground mb-2 flex justify-between">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(currentSong.duration)}</span>
                      </div>
                      <div 
                        className="h-2 bg-secondary rounded-full overflow-hidden cursor-pointer"
                        onClick={handleProgressClick}
                        ref={progressBarRef}
                      >
                        <div
                          className="h-full bg-primary rounded-full relative group"
                          style={{ width: `${progressPercentage}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
