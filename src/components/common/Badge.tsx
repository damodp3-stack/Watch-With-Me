import React from 'react';
import { Star } from 'lucide-react';

export const RatingBadge: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  rating,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1',
    lg: 'text-sm px-2.5 py-1 gap-1.5 font-semibold',
  };

  const getRatingColor = (val: number) => {
    if (val >= 8.5) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (val >= 7.0) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  };

  return (
    <div
      id={`rating-badge-${rating.toFixed(1)}`}
      className={`inline-flex items-center font-medium rounded-md border backdrop-blur-md ${sizeClasses[size]} ${getRatingColor(
        rating
      )} ${className}`}
    >
      <Star className="w-3 h-3 fill-current" />
      <span>{rating.toFixed(1)}</span>
    </div>
  );
};

export const ContentTypeBadge: React.FC<{ type: 'movie' | 'series' | 'anime' }> = ({ type }) => {
  const map = {
    movie: { label: 'Movie', cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    series: { label: 'Series', cls: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    anime: { label: 'Anime', cls: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  };
  const { label, cls } = map[type];
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${cls}`}>
      {label}
    </span>
  );
};

export const QualityBadge: React.FC<{ quality?: string }> = ({ quality = '4K' }) => {
  return (
    <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 uppercase">
      {quality}
    </span>
  );
};

export const LanguageChip: React.FC<{
  language: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}> = ({ language, selected, onClick, size = 'md' }) => {
  return (
    <button
      id={`lang-chip-${language.toLowerCase().replace(/\s+/g, '-')}`}
      type="button"
      onClick={onClick}
      className={`inline-flex items-center transition-all rounded-lg whitespace-nowrap cursor-pointer select-none ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs font-medium'
      } ${
        selected
          ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/25'
          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {language}
    </button>
  );
};

export const GenreChip: React.FC<{
  genre: string;
  selected?: boolean;
  onClick?: () => void;
}> = ({ genre, selected, onClick }) => {
  return (
    <button
      id={`genre-chip-${genre.toLowerCase().replace(/\s+/g, '-')}`}
      type="button"
      onClick={onClick}
      className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer select-none ${
        selected
          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
          : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
      }`}
    >
      {genre}
    </button>
  );
};
