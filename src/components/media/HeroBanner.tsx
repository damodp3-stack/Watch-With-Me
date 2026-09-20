import React, { useEffect, useState } from 'react';
import { Film, Info, Play, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { ContentTypeBadge, QualityBadge, RatingBadge } from '../common/Badge';
import { PlayButton, WatchlistButton } from '../common/Buttons';

export const HeroBanner: React.FC<{ items: MediaItem[] }> = ({ items }) => {
  const { openMediaDetails, openPlayer, openTrailer } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate every 8 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const activeMedia = items[currentIndex];

  return (
    <div id="cinematic-hero-section" className="relative w-full overflow-hidden bg-[#080a0f] border-b border-slate-900">
      {/* Background Backdrop with multiple directional gradient masks for readability */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] min-h-[480px] max-h-[760px]">
        <img
          src={activeMedia.backdrop}
          alt={activeMedia.title}
          className="w-full h-full object-cover object-center transform scale-105 animate-in fade-in zoom-in-95 duration-1000"
        />

        {/* Readability Protection Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f] via-[#080a0f]/80 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#080a0f]/30 to-[#080a0f]" />

        {/* Content Container */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-10 sm:pb-16 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end w-full">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 max-w-2xl">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25">
                  Featured Premiere
                </span>
                <ContentTypeBadge type={activeMedia.type} />
                <RatingBadge rating={activeMedia.rating} size="md" />
                <QualityBadge quality="4K UHD" />
                <span className="text-xs text-slate-300 font-semibold">{activeMedia.contentRating}</span>
              </div>

              {/* Title */}
              <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] drop-shadow-md">
                {activeMedia.title}
              </h1>

              {/* Original title & regional tag if applicable */}
              {activeMedia.originalTitle && activeMedia.originalTitle !== activeMedia.title && (
                <p className="text-sm font-medium text-amber-400/90 -mt-1 font-heading">
                  {activeMedia.originalTitle} • {activeMedia.originalLanguage}
                </p>
              )}

              {/* Quick specs */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                <span>{activeMedia.releaseYear}</span>
                <span>•</span>
                <span>{activeMedia.durationLabel || `${activeMedia.runtimeMinutes}m`}</span>
                <span>•</span>
                <span className="text-amber-300">{activeMedia.languages.slice(0, 3).join(', ')}</span>
                <span>•</span>
                <span className="text-slate-400">{activeMedia.genres.slice(0, 3).join(' / ')}</span>
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm md:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
                {activeMedia.synopsis}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
                <PlayButton
                  onClick={() => openPlayer(activeMedia.id)}
                  label="Watch Now"
                  size="md"
                />

                {activeMedia.trailerUrl && (
                  <button
                    id="btn-hero-trailer"
                    type="button"
                    onClick={() => openTrailer(activeMedia.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-sm font-semibold border border-slate-700/70 transition-all duration-200 backdrop-blur-md cursor-pointer"
                  >
                    <Film className="w-4 h-4 text-amber-400" />
                    <span>Trailer</span>
                  </button>
                )}

                <WatchlistButton mediaId={activeMedia.id} variant="full" />

                <button
                  id="btn-hero-details"
                  type="button"
                  onClick={() => openMediaDetails(activeMedia)}
                  title="More Details"
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Poster Showcase (Desktop only) */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div
                onClick={() => openMediaDetails(activeMedia)}
                className="w-56 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-slate-700/60 shadow-2xl shadow-black/80 hover:scale-105 transition-all duration-300 cursor-pointer group relative"
              >
                <img
                  src={activeMedia.poster}
                  alt={activeMedia.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-semibold text-white">Click for full synopsis & cast</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        {items.length > 1 && (
          <div className="absolute bottom-4 right-4 sm:right-8 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-amber-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
