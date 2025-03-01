
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from 'sonner';

const AudioPlayer: React.FC = () => {
  const { currentSong, isPlaying, playSong, pauseSong } = useMusic();

  // Log when playback state changes
  useEffect(() => {
    if (currentSong) {
      console.log(`PlayState: ${isPlaying ? 'Playing' : 'Paused'} - ${currentSong.title}`);
    }
  }, [currentSong, isPlaying]);

  // Handle case where preview_url is null (Spotify doesn't provide preview for all tracks)
  useEffect(() => {
    if (currentSong && !currentSong.audioSrc && isPlaying) {
      pauseSong();
      toast.error("Preview unavailable", {
        description: "Spotify doesn't provide a preview for this track"
      });
    }
  }, [currentSong, isPlaying, pauseSong]);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-24 right-4 bg-black/80 p-3 rounded-lg border border-white/10 shadow-lg z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
          <img 
            src={currentSong.albumCover} 
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-sm font-medium text-white">{currentSong.title}</div>
          <div className="text-xs text-white/70">{currentSong.artist}</div>
        </div>
        <button 
          className="ml-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
          onClick={() => isPlaying ? pauseSong() : playSong(currentSong)}
          disabled={!currentSong.audioSrc}
          title={!currentSong.audioSrc ? "Preview unavailable" : isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
      </div>
      {!currentSong.audioSrc && (
        <div className="text-xs text-yellow-400 mt-1">
          Preview unavailable for this track
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
