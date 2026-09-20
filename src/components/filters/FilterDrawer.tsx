import React from 'react';
import { RotateCcw, SlidersHorizontal, Star, X } from 'lucide-react';
import { GENRE_LIST, SUPPORTED_LANGUAGES } from '../../config/app.config';
import { useApp } from '../../context/AppContext';
import { FilterState } from '../../types';
import { GenreChip, LanguageChip } from '../common/Badge';

export const FilterDrawer: React.FC = () => {
  const { isFilterDrawerOpen, setIsFilterDrawerOpen, filters, setFilters, resetFilters } = useApp();

  if (!isFilterDrawerOpen) return null;

  const toggleLanguage = (lang: string) => {
    setFilters((prev) => {
      const exists = prev.languages.includes(lang);
      const newLangs = exists
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: newLangs };
    });
  };

  const toggleGenre = (genre: string) => {
    setFilters((prev) => {
      const exists = prev.genres.includes(genre);
      const newGenres = exists
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: newGenres };
    });
  };

  const activeFilterCount =
    filters.languages.length +
    filters.genres.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.contentType !== 'all' ? 1 : 0) +
    (filters.sortBy !== 'trending' ? 1 : 0);

  return (
    <div
      id="filter-drawer-backdrop"
      onClick={() => setIsFilterDrawerOpen(false)}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
    >
      <div
        id="filter-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-[#0b0e14] border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-lg text-white">Filter & Refine</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                {activeFilterCount} Active
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable filter sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Content Type
            </label>
            <div className="grid grid-cols-4 gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {(['all', 'movie', 'series', 'anime'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, contentType: type }))}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    filters.contentType === type
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Languages (Multi-select) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Languages ({filters.languages.length} Selected)
              </label>
              {filters.languages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, languages: [] }))}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Select one or multiple languages (e.g. Tamil + Telugu + English)
            </p>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = filters.languages.includes(lang.name);
                return (
                  <LanguageChip
                    key={lang.code}
                    language={`${lang.flag} ${lang.name}`}
                    selected={isSelected}
                    onClick={() => toggleLanguage(lang.name)}
                    size="sm"
                  />
                );
              })}
            </div>
          </div>

          {/* Genres (Multi-select) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Genres ({filters.genres.length} Selected)
              </label>
              {filters.genres.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, genres: [] }))}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GENRE_LIST.map((genre) => {
                const isSelected = filters.genres.includes(genre);
                return (
                  <GenreChip
                    key={genre}
                    genre={genre}
                    selected={isSelected}
                    onClick={() => toggleGenre(genre)}
                  />
                );
              })}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Minimum Rating
              </label>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+` : 'Any Rating'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={filters.minRating}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minRating: parseFloat(e.target.value) }))
              }
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>All</span>
              <span>7.0+</span>
              <span>8.0+</span>
              <span>9.0+</span>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Release Year
              </label>
              <span className="text-xs font-medium text-slate-300">
                {filters.yearRange[0]} – {filters.yearRange[1]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">From</span>
                <input
                  type="number"
                  min="1970"
                  max="2026"
                  value={filters.yearRange[0]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1970;
                    setFilters((prev) => ({ ...prev, yearRange: [val, prev.yearRange[1]] }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">To</span>
                <input
                  type="number"
                  min="1970"
                  max="2026"
                  value={filters.yearRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 2026;
                    setFilters((prev) => ({ ...prev, yearRange: [prev.yearRange[0], val] }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'trending', label: 'Trending First' },
                { id: 'rating', label: 'Highest Rated' },
                { id: 'newest', label: 'Recently Released' },
                { id: 'title', label: 'Alphabetical' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, sortBy: opt.id as FilterState['sortBy'] }))
                  }
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    filters.sortBy === opt.id
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#080a0f] flex items-center gap-3">
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(false)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
