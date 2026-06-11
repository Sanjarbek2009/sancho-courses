'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, FastForward, Settings } from 'lucide-react';

interface CustomVideoPlayerProps {
  videoUrl: string;
  onEnded?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function CustomVideoPlayer({ videoUrl, onEnded }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ytPlayerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 11)}`);

  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [videoUrl]);

  // Sync state for YouTube video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isYouTube && isPlaying && ytPlayer) {
      interval = setInterval(() => {
        if (ytPlayer.getCurrentTime) {
          setCurrentTime(ytPlayer.getCurrentTime());
        }
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isYouTube, isPlaying, ytPlayer]);

  const getYouTubeVideoId = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    return videoId;
  };

  // Handle YouTube Player lifecycle
  useEffect(() => {
    if (!isYouTube) return;

    let player: any = null;

    const initPlayer = () => {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) return;

      player = new window.YT.Player(ytPlayerId.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            setYtPlayer(event.target);
            setDuration(event.target.getDuration());
            
            // Apply initial settings
            event.target.setVolume(volume * 100);
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
            event.target.setPlaybackRate(playbackRate);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              if (onEnded) onEnded();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // If the API script is not loaded, check if it's already added to document
      const existingTag = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingTag) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch {
          // Ignore destroy errors
        }
      }
      setYtPlayer(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYouTube, videoUrl]);

  // Context Menu blocker on container
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu);
    }
    return () => {
      if (container) {
        container.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, []);

  const getVimeoEmbedUrl = (url: string) => {
    const parts = url.split('/');
    const videoId = parts[parts.length - 1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  };

  const handlePlayPause = () => {
    if (isYouTube) {
      if (!ytPlayer) return;
      if (isPlaying) {
        ytPlayer.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayer.playVideo();
        setIsPlaying(true);
      }
    } else {
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (isYouTube) {
      if (ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(time, true);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (isYouTube) {
      if (ytPlayer && ytPlayer.setVolume) {
        ytPlayer.setVolume(vol * 100);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.volume = vol;
      }
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isYouTube) {
      if (ytPlayer) {
        if (nextMuted) {
          ytPlayer.mute();
        } else {
          ytPlayer.unMute();
          ytPlayer.setVolume(volume * 100);
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.muted = nextMuted;
        videoRef.current.volume = nextMuted ? 0 : volume;
      }
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isYouTube) {
      if (ytPlayer && ytPlayer.setPlaybackRate) {
        ytPlayer.setPlaybackRate(rate);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (isVimeo) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <iframe
          src={getVimeoEmbedUrl(videoUrl)}
          title="Vimeo Video Player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {onEnded && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onEnded}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#6366F1]/80 hover:bg-[#6366F1] text-white text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-lg"
            >
              <FastForward size={14} />
              Darsni Yakunlash (Auto-Advance)
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black group select-none"
    >
      {isYouTube ? (
        <div className="w-full h-full pointer-events-none select-none">
          <div id={ytPlayerId.current} className="w-full h-full" />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4'}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onEnded}
          playsInline
        />
      )}

      {/* Transparent overlay for YouTube frame protection */}
      {isYouTube && (
        <div 
          onClick={handlePlayPause}
          className="absolute inset-0 z-10 bg-transparent cursor-pointer"
        />
      )}

      {onEnded && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onEnded}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#6366F1]/80 hover:bg-[#6366F1] text-white text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-lg"
          >
            <FastForward size={14} />
            Darsni Yakunlash (Auto-Advance)
          </button>
        </div>
      )}

      {!isPlaying && (
        <div 
          onClick={handlePlayPause}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 cursor-pointer transition-all duration-300 animate-fadeIn"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:scale-110 transition-transform duration-300">
            <Play fill="black" size={28} className="ml-1" />
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 flex flex-col gap-3 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#94A3B8] font-mono">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none"
          />
          <span className="text-xs text-[#94A3B8] font-mono">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayPause} className="text-white hover:text-[#D4AF37] transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="flex items-center gap-2 group/volume">
              <button onClick={handleToggleMute} className="text-white hover:text-[#D4AF37] transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white transition-all duration-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group/speed">
              <button className="flex items-center gap-1 text-xs text-white hover:text-[#D4AF37] bg-white/10 px-2.5 py-1 rounded-md border border-white/10 transition-all">
                <Settings size={12} />
                {playbackRate}x
              </button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover/speed:flex flex-col bg-[#0B0B0C] border border-white/10 rounded-lg overflow-hidden shadow-2xl z-30">
                {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleSpeedChange(rate)}
                    className={`px-4 py-1.5 text-xs text-left whitespace-nowrap hover:bg-white/10 transition-colors ${
                      playbackRate === rate ? 'text-[#D4AF37] font-semibold' : 'text-[#94A3B8]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleToggleFullscreen} className="text-white hover:text-[#D4AF37] transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
