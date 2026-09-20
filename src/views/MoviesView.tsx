import React, { useEffect, useState } from 'react';
import { Film, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import { EmptyState } from '../components/common/States';
import { MediaCard } from '../components/media/MediaCard';
import { useApp } from '../context/AppContext';
import { mediaApi } from '../services/api';
import { MediaItem } from '../types';

export const MoviesView: React.FC = () => {
  const { filters, setIsFilterDrawerOpen, resetFilters } = useApp();
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mediaApi
      .getMovies(filters)
      .then((data) => {
        if (isMounted) {
          setMovies(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <div id="movies-page-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header with Title and Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                Movies Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Explore blockbusters, theatrical premieres, and acclaimed cinema across languages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">
            {movies.length} {movies.length === 1 ? 'Title' : 'Titles'}
          </span>
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-400 font-semibold text-xs border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Refine & Filter</span>
          </button>
        </div>
      </div>

      {/* Active filters pill bar if any */}
      {(filters.languages.length > 0 || filters.genres.length > 0 || filters.minRating > 0) && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Applied Filters:</span>
          {filters.languages.map((l) => (
            <span key={l} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
              {l}
            </span>
          ))}
          {filters.genres.map((g) => (
            <span key={g} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {g}
            </span>
          ))}
          {filters.minRating > 0 && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              ★ {filters.minRating}+
            </span>
          )}
          <button
            type="button"
            onClick={resetFilters}
            className="text-slate-400 hover:text-white underline ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <EmptyState
          title="No movies match your criteria"
          description="Try loosening your filters or resetting to default to browse our full film library."
          actionLabel="Reset Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MediaCard key={movie.id} media={movie} size="md" />
          ))}
        </div>
      )}
    </div>
  );
};
