import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, Tv } from 'lucide-react';
import { EmptyState } from '../components/common/States';
import { MediaCard } from '../components/media/MediaCard';
import { useApp } from '../context/AppContext';
import { mediaApi } from '../services/api';
import { MediaItem } from '../types';

export const SeriesView: React.FC = () => {
  const { filters, setIsFilterDrawerOpen, resetFilters } = useApp();
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mediaApi
      .getSeries(filters)
      .then((data) => {
        if (isMounted) {
          setSeries(data);
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
    <div id="series-page-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Television & Series
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Multi-season episodic stories, thrillers, and acclaimed dramas with full episode guides.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">
            {series.length} {series.length === 1 ? 'Show' : 'Shows'}
          </span>
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-300 font-semibold text-xs border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Series</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : series.length === 0 ? (
        <EmptyState
          title="No series found"
          description="Try modifying your language or genre filters."
          actionLabel="Reset Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {series.map((show) => (
            <MediaCard key={show.id} media={show} size="md" />
          ))}
        </div>
      )}
    </div>
  );
};
