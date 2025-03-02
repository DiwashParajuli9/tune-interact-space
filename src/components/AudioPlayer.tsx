
import React, { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const { currentSong, isPlaying, playSong, pauseSong } = useMusic();
  const [hasError, setHasError] = useState(false);

  // Reset error state when current song changes
  useEffect(() => {
    if (currentSong) {
      setHasError(false);
    }
  }, [currentSong]);

  // Log when playback state changes
  useEffect(() => {
    if (currentSong) {
      console.log(`PlayState: ${isPlaying ? 'Playing' : 'Paused'} - ${currentSong.title}`);
      
      // Check if the song has a valid preview URL
      if (!currentSong.audioSrc || currentSong.audioSrc === "null") {
        setHasError(true);
        pauseSong();
        toast.error("Preview not available for this track", {
          description: "Try another song or open in Spotify"
        });
      }
    }
  }, [currentSong, isPlaying]);

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
          {hasError && currentSong.externalUrl && (
            <a 
              href={currentSong.externalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-1"
            >
              Open in Spotify <ExternalLink size={12} />
            </a>
          )}
        </div>
        <button 
          className={`ml-2 w-8 h-8 rounded-full ${hasError ? 'bg-gray-500/50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center`}
          onClick={() => !hasError && (isPlaying ? pauseSong() : playSong(currentSong))}
          disabled={hasError}
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
    </div>
  );
};

export default AudioPlayer;
