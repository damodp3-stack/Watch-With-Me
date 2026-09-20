import React from 'react';
import { Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { ContentTypeBadge, RatingBadge } from '../common/Badge';
import { WatchlistButton } from '../common/Buttons';

export const MediaCard: React.FC<{
  media: MediaItem;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: number; // progress percent 0-100
  onRemove?: () => void;
}> = ({ media, size = 'md', showProgress, onRemove }) => {
  const { openMediaDetails, openPlayer } = useApp();

  const widthClass = {
    sm: 'w-32 sm:w-36 md:w-40',
    md: 'w-36 sm:w-44 md:w-48 lg:w-52',
    lg: 'w-44 sm:w-52 md:w-60',
  }[size];

  return (
    <div
      id={`media-card-${media.id}`}
      onClick={() => openMediaDetails(media)}
      className={`group relative flex-shrink-0 ${widthClass} cursor-pointer select-none transition-transform duration-300 hover:-translate-y-1.5 focus:outline-none`}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-lg group-hover:shadow-amber-500/10 group-hover:border-slate-700 transition-all duration-300">
        <img
          src={media.poster}
          alt={media.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <RatingBadge rating={media.rating} size="sm" />
          <div className="pointer-events-auto">
            <WatchlistButton mediaId={media.id} />
          </div>
        </div>

        {/* Bottom subtle gradient on card */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openPlayer(media.id);
            }}
            title="Play Now"
            className="p-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/40 transform scale-90 group-hover:scale-100 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
          </button>
        </div>

        {/* Continue watching progress bar */}
        {typeof showProgress === 'number' && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-r"
              style={{ width: `${Math.min(100, Math.max(0, showProgress))}%` }}
            />
          </div>
        )}
      </div>

      {/* Title & Metadata */}
      <div className="mt-2.5 px-0.5 space-y-1">
        <div className="flex items-center justify-between gap-1">
          <ContentTypeBadge type={media.type} />
          <span className="text-[11px] text-slate-400 font-medium">{media.releaseYear}</span>
        </div>

        <h4 className="font-heading font-semibold text-sm text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
          {media.title}
        </h4>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
          <span className="text-amber-400/90 font-medium">{media.originalLanguage}</span>
          <span>•</span>
          <span className="truncate">{media.genres.slice(0, 2).join(', ')}</span>
        </div>
      </div>
    </div>
  );
};
