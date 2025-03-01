
import React, { useEffect, useState, useRef } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from 'sonner';
import { VolumeX, Volume1, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const AudioPlayer: React.FC = () => {
  const { currentSong, isPlaying, playSong, pauseSong, setVolume, volume } = useMusic();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Log when playback state changes
  useEffect(() => {
    if (currentSong) {
      console.log(`PlayState: ${isPlaying ? 'Playing' : 'Paused'} - ${currentSong.title}`);
    }
  }, [currentSong, isPlaying]);

  // Update audio element when current song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioSrc;
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error);
            toast.error("Failed to play song. Please try again.");
            pauseSong();
          });
        }
      }
    }
  }, [currentSong, pauseSong]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error);
            toast.error("Playback was interrupted. Please try again.");
            pauseSong();
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, pauseSong]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      // If song ends, reset current time and pause
      setCurrentTime(0);
      pauseSong();
    };
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      toast.error("Error playing this track. Please try another.");
      pauseSong();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [pauseSong]);

  // Format time to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle volume icon based on level
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (!currentSong) return null;

  return (
    <>
      {/* Hidden audio element that does the actual playing */}
      <audio ref={audioRef} preload="metadata" />
      
      <div className="fixed bottom-24 right-4 bg-black/80 p-3 rounded-lg border border-white/10 shadow-lg z-50 w-80">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
            <img 
              src={currentSong.albumCover} 
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{currentSong.title}</div>
            <div className="text-xs text-white/70 truncate">{currentSong.artist}</div>
          </div>
          <button 
            className="ml-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
            onClick={() => isPlaying ? pauseSong() : playSong(currentSong)}
            aria-label={isPlaying ? "Pause" : "Play"}
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
        
        {/* Progress bar */}
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-primary h-full rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Time display */}
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center">
          <button 
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            className="text-white/70 p-1 hover:text-white"
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            <VolumeIcon size={16} />
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            className="w-full ml-2"
            onValueChange={(value) => setVolume(value[0] / 100)}
          />
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
