
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Maximize2, Minimize2, ListMusic } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/contexts/MusicContext";
import { cn } from "@/lib/utils";

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
  } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>([]);

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

  // Visualizer animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newHeights = Array(6)
          .fill(0)
          .map(() => Math.floor(Math.random() * 24) + 4);
        setVisualizerHeights(newHeights);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setVisualizerHeights(Array(6).fill(4));
    }
  }, [isPlaying]);

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
            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
          </div>

          {/* Center controls */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center space-x-4">
              <button
                onClick={prevSong}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={isPlaying ? pauseSong : () => playSong(currentSong)}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={nextSong}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward size={20} />
              </button>
            </div>
            <div className="w-full mt-1 flex items-center space-x-2 text-xs">
              <span className="text-muted-foreground">
                {formatTime(progress)}
              </span>
              <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
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
                  <VolumeX size={18} />
                ) : volume < 0.5 ? (
                  <Volume1 size={18} />
                ) : (
                  <Volume2 size={18} />
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

            <button
              onClick={() => setShowQueue(!showQueue)}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                showQueue && expanded && "text-primary"
              )}
            >
              <ListMusic size={18} />
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        {/* Expanded player */}
        {expanded && (
          <div className="h-76 p-6 animate-fade-in">
            <div className="flex h-full">
              {/* Album art and visualizer */}
              <div className="w-2/3 pr-8 flex flex-col items-center justify-center">
                <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg mb-6">
                  <img
                    src={currentSong.albumCover}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Music visualizer */}
                <div className="visualizer mt-4">
                  {visualizerHeights.map((height, i) => (
                    <div
                      key={i}
                      className="visualizer-bar"
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Song info or queue */}
              <div className="w-1/3 flex flex-col">
                {showQueue ? (
                  <>
                    <h3 className="text-lg font-medium mb-4">Up Next</h3>
                    <div className="overflow-y-auto flex-1">
                      {queue.length > 0 ? (
                        <div className="space-y-3">
                          {queue.map((song) => (
                            <div
                              key={song.id}
                              className="flex items-center p-2 rounded-md hover:bg-primary/5 transition-colors cursor-pointer"
                              onClick={() => playSong(song)}
                            >
                              <div className="w-10 h-10 rounded overflow-hidden bg-muted mr-3">
                                <img
                                  src={song.albumCover}
                                  alt={song.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="truncate">
                                <h4 className="text-sm font-medium truncate">
                                  {song.title}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                  {song.artist}
                                </p>
                              </div>
                              <div className="ml-auto text-xs text-muted-foreground">
                                {formatTime(song.duration)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">Queue is empty</p>
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

                    <p className="text-sm text-muted-foreground mb-8">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, 
                      nisl vitae fermentum ultricies, sapien nisl tincidunt nunc, vel sagittis 
                      nunc nisl vel nisl.
                    </p>

                    <div className="mt-auto">
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatTime(progress)} / {formatTime(currentSong.duration)}
                      </div>
                      <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
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
