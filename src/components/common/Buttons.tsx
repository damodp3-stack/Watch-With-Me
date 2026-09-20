import React from 'react';
import { Bookmark, BookmarkCheck, Play, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WatchlistButton: React.FC<{
  mediaId: string;
  variant?: 'icon' | 'full';
  className?: string;
}> = ({ mediaId, variant = 'icon', className = '' }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const inList = isInWatchlist(mediaId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(mediaId);
    } else {
      addToWatchlist(mediaId);
    }
  };

  if (variant === 'full') {
    return (
      <button
        id={`btn-watchlist-${mediaId}`}
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
          inList
            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
            : 'bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-md'
        } ${className}`}
      >
        {inList ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4" />}
        <span>{inList ? 'In My List' : 'Add to My List'}</span>
      </button>
    );
  }

  return (
    <button
      id={`btn-watchlist-icon-${mediaId}`}
      type="button"
      onClick={handleClick}
      title={inList ? 'Remove from My List' : 'Add to My List'}
      className={`p-2 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md ${
        inList
          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/30'
          : 'bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/10'
      } ${className}`}
    >
      {inList ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
    </button>
  );
};

export const PlayButton: React.FC<{
  onClick?: (e: React.MouseEvent) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ onClick, label = 'Watch Now', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2 font-semibold',
    lg: 'px-7 py-3 text-base gap-2.5 font-bold',
  };

  return (
    <button
      id={`btn-play-${label.toLowerCase().replace(/\s+/g, '-')}`}
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${sizeMap[size]} ${className}`}
    >
      <Play className="w-4 h-4 fill-slate-950" />
      <span>{label}</span>
    </button>
  );
};

export const RemoveButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  title?: string;
}> = ({ onClick, title = 'Remove' }) => {
  return (
    <button
      id={`btn-remove-item`}
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 transition-all cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};
