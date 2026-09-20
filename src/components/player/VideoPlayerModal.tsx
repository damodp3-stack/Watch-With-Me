import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Captions,
  Check,
  ChevronRight,
  FastForward,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mediaApi } from '../../services/api';
import { Episode, MediaItem, PlaybackSource, SubtitleTrack } from '../../types';

export const VideoPlayerModal: React.FC<{ mediaId: string; episodeId?: string }> = ({
  mediaId,
  episodeId,
}) => {
  const { closeModal, recordWatchProgress, userProfile, showToast } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [media, setMedia] = useState<MediaItem | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [sources, setSources] = useState<PlaybackSource[]>([]);
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [activeSource, setActiveSource] = useState<PlaybackSource | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(userProfile.preferences.volume || 0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Subtitle state & styling (Requirement 17)
  const [activeSubtitle, setActiveSubtitle] = useState<string>('English'); // 'none' or language name
  const [subFontSize, setSubFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [subColor, setSubColor] = useState<string>('#ffffff');
  const [subBgOpacity, setSubBgOpacity] = useState<number>(0.6);
  const [currentSubText, setCurrentSubText] = useState<string>('');

  // Menus
  const [activeMenu, setActiveMenu] = useState<'none' | 'settings' | 'audio' | 'subtitles' | 'episodes'>('none');

  // Resume state (Requirement 18)
  const [resumeTimePrompt, setResumeTimePrompt] = useState<number | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load playback data
  useEffect(() => {
    let isMounted = true;
    mediaApi.getMovieDetails(mediaId).then((item) => {
      if (!isMounted || !item) return;
      setMedia(item);

      // Find episode if series
      if (item.seasons && episodeId) {
        for (const s of item.seasons) {
          const ep = s.episodes.find((e) => e.id === episodeId);
          if (ep) {
            setCurrentEpisode(ep);
            break;
          }
        }
      }

      mediaApi.getPlayback(mediaId, episodeId).then((pb) => {
        if (!isMounted) return;
        setSources(pb.sources);
        setSubtitles(pb.subtitles);
        if (pb.sources.length > 0) {
          setActiveSource(pb.sources[0]);
        }
      });

      // Check existing history to prompt resume
      mediaApi.getHistory().then((historyList) => {
        if (!isMounted) return;
        const existing = historyList.find(
          (h) => h.mediaId === mediaId && (episodeId ? h.episodeId === episodeId : true)
        );
        if (existing && existing.currentTimeSeconds > 15 && existing.progressPercent < 95) {
          setResumeTimePrompt(existing.currentTimeSeconds);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, [mediaId, episodeId]);

  // Periodic watch progress recording (Requirement 18)
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && duration > 0) {
        const time = videoRef.current.currentTime;
        recordWatchProgress({
          mediaId,
          episodeId,
          seasonNumber: currentEpisode ? 1 : undefined,
          episodeNumber: currentEpisode?.episodeNumber,
          currentTimeSeconds: time,
          durationSeconds: duration,
        });
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [mediaId, episodeId, currentEpisode, duration, recordWatchProgress]);

  // Keyboard shortcuts (Requirement 16)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekBy(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((prev) => Math.min(1, prev + 0.1));
          setIsMuted(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 0.1));
          break;
        case 'KeyM':
          setIsMuted((prev) => !prev);
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else {
            closeModal();
          }
          break;
      }
      triggerControls();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, duration]);

  // Sync video volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Simulated subtitle cues based on current playback time
  useEffect(() => {
    if (activeSubtitle === 'none') {
      setCurrentSubText('');
      return;
    }
    const track = subtitles.find((s) => s.language.toLowerCase() === activeSubtitle.toLowerCase());
    if (track && track.cues && track.cues.length > 0) {
      const match = track.cues.find((c) => currentTime >= c.startTime && currentTime <= c.endTime);
      setCurrentSubText(match ? match.text : '');
    } else {
      // Benchmark dialogue subtitles if not individually segmented
      const sampleDialogue = [
        { start: 2, end: 7, text: `[${media?.title || 'Cinema'}] - Welcome to Streamora presentation.` },
        { start: 8, end: 14, text: `In a world transformed by courage, every decision shapes destiny.` },
        { start: 16, end: 23, text: `Listen carefully... the truth isn't what it seems.` },
        { start: 26, end: 32, text: `We fight for what matters most: our family and our people.` },
        { start: 35, end: 42, text: `[Intense orchestral score crescendoes in ${activeSubtitle}]` },
      ];
      const match = sampleDialogue.find((c) => currentTime >= c.start && currentTime <= c.end);
      setCurrentSubText(match ? match.text : '');
    }
  }, [currentTime, activeSubtitle, subtitles, media?.title]);

  const triggerControls = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setActiveMenu('none');
      }
    }, 4000);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    triggerControls();
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    triggerControls();
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const target = pos * duration;
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}:${(mins % 60).toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const handleResumeClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
    setResumeTimePrompt(null);
    showToast(`Resumed from ${formatTime(time)}`, 'info');
  };

  // Next episode trigger
  const handleNextEpisode = () => {
    if (!media?.seasons) return;
    const allEpisodes = media.seasons.flatMap((s) => s.episodes);
    const currentIdx = allEpisodes.findIndex((e) => e.id === episodeId);
    if (currentIdx !== -1 && currentIdx + 1 < allEpisodes.length) {
      const nextEp = allEpisodes[currentIdx + 1];
      setCurrentEpisode(nextEp);
      // Reset player for next ep
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      showToast(`Playing Episode ${nextEp.episodeNumber}: ${nextEp.title}`, 'info');
    }
  };

  return (
    <div
      ref={containerRef}
      id="video-player-modal"
      onMouseMove={triggerControls}
      onClick={triggerControls}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        id="html5-video-player"
        src={activeSource?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
        autoPlay
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration || 600);
            setIsPlaying(!videoRef.current.paused);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          handleNextEpisode();
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Subtitle Rendering Overlay (Requirement 17) */}
      {currentSubText && (
        <div className="absolute bottom-20 sm:bottom-24 left-4 right-4 flex justify-center pointer-events-none z-30">
          <span
            style={{
              color: subColor,
              backgroundColor: `rgba(0, 0, 0, ${subBgOpacity})`,
              fontSize: subFontSize === 'sm' ? '14px' : subFontSize === 'lg' ? '24px' : '18px',
            }}
            className="px-4 py-1.5 rounded-lg font-medium text-center shadow-lg transition-all"
          >
            {currentSubText}
          </span>
        </div>
      )}

      {/* Resume Playback Prompt Banner (Requirement 18) */}
      {resumeTimePrompt !== null && (
        <div
          id="resume-playback-prompt"
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 bg-[#0e121a]/95 border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center gap-4 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="text-left">
            <p className="font-heading font-bold text-sm text-white">Resume playback?</p>
            <p className="text-xs text-slate-300">
              You were previously at <span className="text-amber-400 font-semibold">{formatTime(resumeTimePrompt)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleResumeClick(resumeTimePrompt)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => setResumeTimePrompt(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Top Header Overlay (Title, Quality Badge, Close) */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-40 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Exit Player"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white">
              {media?.title}
            </h3>
            {currentEpisode ? (
              <p className="text-xs text-amber-400">
                Episode {currentEpisode.episodeNumber}: {currentEpisode.title}
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                {media?.releaseYear} • {media?.originalLanguage}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {activeSource?.resolution || '1080p Full HD'}
          </span>
        </div>
      </div>

      {/* Settings / Audio / Subtitles Popovers */}
      {activeMenu !== 'none' && (
        <div
          id="player-sub-menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-24 right-6 z-40 w-72 p-4 rounded-2xl bg-[#0b0e14]/95 border border-slate-700 shadow-2xl backdrop-blur-xl text-xs space-y-3"
        >
          {/* Subtitles menu */}
          {activeMenu === 'subtitles' && (
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-white">
                <span>Subtitles Track</span>
                <button
                  type="button"
                  onClick={() => setActiveMenu('none')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 my-2 max-h-48 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setActiveSubtitle('none')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                    activeSubtitle === 'none' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Off</span>
                  {activeSubtitle === 'none' && <Check className="w-4 h-4" />}
                </button>
                {subtitles.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubtitle(sub.language)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                      activeSubtitle.toLowerCase() === sub.language.toLowerCase()
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{sub.label || sub.language}</span>
                    {activeSubtitle.toLowerCase() === sub.language.toLowerCase() && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>

              {/* Subtitle Font & Styling controls */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Style & Size</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSubFontSize(sz)}
                      className={`py-1 rounded text-center cursor-pointer uppercase ${
                        subFontSize === sz ? 'bg-amber-500 text-black font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quality & Audio settings */}
          {activeMenu === 'settings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-white">
                <span>Playback Settings</span>
                <button
                  type="button"
                  onClick={() => setActiveMenu('none')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quality */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Stream Quality</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {sources.map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => {
                        setActiveSource(src);
                        showToast(`Quality: ${src.resolution}`, 'info');
                      }}
                      className={`p-1.5 rounded-lg text-center font-medium cursor-pointer ${
                        activeSource?.id === src.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {src.resolution} ({src.quality})
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Speed</span>
                <div className="grid grid-cols-4 gap-1">
                  {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`py-1 rounded text-center cursor-pointer ${
                        playbackSpeed === spd ? 'bg-amber-500 text-black font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Audio Tracks */}
          {activeMenu === 'audio' && (
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-white">
                <span>Audio Tracks</span>
                <button
                  type="button"
                  onClick={() => setActiveMenu('none')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 my-2">
                {media?.languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      showToast(`Audio set to ${lang} (5.1 Surround)`, 'info');
                      setActiveMenu('none');
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
                  >
                    <span>{lang} (Original / Dubbed)</span>
                    <span className="text-[10px] text-amber-400">Dolby 5.1</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-40 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seekable Progress Bar */}
        <div
          id="player-timeline-container"
          onClick={handleProgressBarClick}
          className="relative w-full h-2 hover:h-3.5 bg-slate-700/60 rounded-full cursor-pointer transition-all mb-4 group"
        >
          {/* Buffered / Progress */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md transform scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* Buttons and controls row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Controls: Play, Seek -10/+10, Next Ep, Volume, Timers */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-amber-500/30"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => seekBy(-10)}
              className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Seek -10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => seekBy(10)}
              className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Seek +10s"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Next Episode button if available */}
            {media?.seasons && (
              <button
                type="button"
                onClick={handleNextEpisode}
                className="p-2 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                title="Next Episode"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}

            {/* Volume & Slider */}
            <div className="flex items-center gap-2 group/volume">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 sm:w-20 h-1.5 accent-amber-500 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Time readout */}
            <div className="text-xs font-mono text-slate-300">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Audio, Subtitles, Settings, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio menu trigger */}
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'audio' ? 'none' : 'audio')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeMenu === 'audio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Audio Tracks"
            >
              <span className="text-xs font-bold uppercase">Audio</span>
            </button>

            {/* Subtitles menu trigger */}
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'subtitles' ? 'none' : 'subtitles')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeSubtitle !== 'none' || activeMenu === 'subtitles'
                  ? 'text-amber-400'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Subtitles / Closed Captions"
            >
              <Captions className="w-5 h-5" />
            </button>

            {/* Settings trigger */}
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'settings' ? 'none' : 'settings')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeMenu === 'settings' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
              title="Quality & Speed"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
