import React, { useState } from 'react';
import { Download, Heart, Play, Trash2, Upload } from 'lucide-react';
import { EmptyState } from '../components/common/States';
import { MediaCard } from '../components/media/MediaCard';
import { useApp } from '../context/AppContext';

export const WatchlistView: React.FC = () => {
  const { watchlist, removeFromWatchlist, setCurrentView, showToast } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series' | 'anime'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title'>('recent');

  const filteredItems = watchlist.filter((item) => {
    if (filterType === 'all') return true;
    return item.mediaType === filterType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.media.rating - a.media.rating;
    }
    if (sortBy === 'title') {
      return a.media.title.localeCompare(b.media.title);
    }
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  // Export JSON (Requirement 19)
  const exportWatchlist = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `streamora-watchlist-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Watchlist exported to JSON', 'success');
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          localStorage.setItem('streamora_watchlist', JSON.stringify(parsed));
          window.location.reload();
        }
      } catch (err) {
        showToast('Invalid JSON file format', 'warn');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="watchlist-page-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              My Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Personal cinema collection saved for offline planning and future sessions.
            </p>
          </div>
        </div>

        {/* Export / Import Controls */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            type="button"
            onClick={exportWatchlist}
            disabled={watchlist.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-50 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-fit">
          {(['all', 'movie', 'series', 'anime'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                filterType === type ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Items list */}
      {sortedItems.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          description="Browse trending movies and series and click the Bookmark icon to save them to your personal collection."
          actionLabel="Explore Movies"
          onAction={() => setCurrentView('movies')}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {sortedItems.map((item) => (
            <div key={item.id} className="relative group">
              <MediaCard media={item.media} size="md" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(item.mediaId);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                title="Remove from list"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
