
import React, { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const { currentSong, isPlaying, playSong, pauseSong } = useMusic();
  const [audioUnavailable, setAudioUnavailable] = useState<boolean>(false);

  // Log when playback state changes
  useEffect(() => {
    if (currentSong) {
      console.log(`PlayState: ${isPlaying ? 'Playing' : 'Paused'} - ${currentSong.title}`);
      
      // Check if audio source is available
      setAudioUnavailable(!currentSong.audioSrc);
      
      if (!currentSong.audioSrc && isPlaying) {
        toast.error("No preview available for this track", {
          description: "Spotify only provides previews for some tracks"
        });
        pauseSong();
      }
    }
  }, [currentSong, isPlaying, pauseSong]);

  if (!currentSong) return null;

  // Check if the song is from Spotify (ID starts with "spotify-")
  const isSpotifySong = currentSong.id.startsWith('spotify-');
  const spotifyId = isSpotifySong ? currentSong.id.replace('spotify-', '') : '';
  const spotifyUrl = currentSong.spotifyUrl || `https://open.spotify.com/track/${spotifyId}`;

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
          {audioUnavailable && (
            <div className="text-xs text-amber-400 mt-0.5">No preview available</div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isSpotifySong && (
            <a 
              href={spotifyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
              title="Open in Spotify"
            >
              <ExternalLink size={14} />
            </a>
          )}
          
          <button 
            className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center ${
              audioUnavailable ? 'bg-gray-600 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={() => !audioUnavailable && (isPlaying ? pauseSong() : playSong(currentSong))}
            disabled={audioUnavailable}
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
    </div>
  );
};

export default AudioPlayer;
