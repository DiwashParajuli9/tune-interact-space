import React, { useEffect, useRef } from 'react';
import { useMusic } from '@/contexts/MusicContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onReady, onStateChange }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPlaying, pauseSong } = useMusic();

  useEffect(() => {
    // Load YouTube iframe API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      if (containerRef.current && window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '200',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            onReady: (event: any) => {
              onReady?.();
            },
            onStateChange: (event: any) => {
              onStateChange?.(event.data);
              
              // Sync with music context
              if (event.data === window.YT.PlayerState.PLAYING && !isPlaying) {
                // YouTube player started, but our context doesn't know
              } else if (event.data === window.YT.PlayerState.PAUSED && isPlaying) {
                pauseSong();
              }
            },
          },
        });
      }
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onReady, onStateChange, isPlaying, pauseSong]);

  // Control playback based on music context
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full h-48 bg-muted rounded-lg" />
    </div>
  );
};

export default YouTubePlayer;