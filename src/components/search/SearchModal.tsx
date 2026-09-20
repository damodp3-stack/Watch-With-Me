import React, { useEffect, useRef, useState } from 'react';
import { Clock, Flame, History, Search, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mediaApi } from '../../services/api';
import { MediaItem } from '../../types';
import { ContentTypeBadge, RatingBadge } from '../common/Badge';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openMediaDetails } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local storage recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('streamora_recent_searches');
    return saved ? JSON.parse(saved) : ['Leo', 'Kalki 2898 AD', 'Kamal Haasan', 'Tamil Action', 'Jujutsu Kaisen'];
  });

  const trendingSearches = [
    'Pushpa 2',
    'Manjummel Boys',
    'Lokesh Kanagaraj',
    'Solo Leveling',
    'Cyberpunk Edgerunners',
    'Anirudh Ravichander',
  ];

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await mediaApi.search(query.trim());
        setResults(data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectTerm = (term: string) => {
    setQuery(term);
  };

  const handleSelectItem = (item: MediaItem) => {
    // Save to recent searches
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const updated = [query.trim(), ...recentSearches.slice(0, 7)];
      setRecentSearches(updated);
      localStorage.setItem('streamora_recent_searches', JSON.stringify(updated));
    }
    setIsSearchOpen(false);
    openMediaDetails(item);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('streamora_recent_searches');
  };

  if (!isSearchOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      onClick={() => setIsSearchOpen(false)}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-150"
    >
      <div
        id="search-modal-window"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0b0e14] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* Search input bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by movie title, actor, director, genre, language (e.g. Leo, Kamal, Action)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* Content area: Instant results OR Trending/Recent */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {query.trim().length > 0 ? (
            /* Results list */
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 text-xs text-slate-400 border-b border-slate-800/80">
                <span>{isLoading ? 'Searching...' : `${results.length} titles matched`}</span>
                <span className="text-amber-400/90 font-medium">Instant Discovery</span>
              </div>

              {results.length === 0 && !isLoading && (
                <div className="py-12 text-center text-slate-400">
                  <p className="font-semibold text-white mb-1">No matching titles found</p>
                  <p className="text-xs">Try searching by original title, star cast (e.g. Vijay, Rajinikanth), or language.</p>
                </div>
              )}

              <div className="space-y-2">
                {results.map((item) => (
                  <div
                    key={item.id}
                    id={`search-result-${item.id}`}
                    onClick={() => handleSelectItem(item)}
                    className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-850 cursor-pointer transition-colors group"
                  >
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-12 h-16 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <ContentTypeBadge type={item.type} />
                        <span className="text-xs text-slate-400">{item.releaseYear}</span>
                        <span className="text-xs text-amber-400 font-medium">{item.originalLanguage}</span>
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {item.cast.slice(0, 3).map((c) => c.name).join(', ')}
                      </p>
                    </div>
                    <RatingBadge rating={item.rating} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Recent searches & Trending */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 text-xs font-semibold text-slate-400 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[11px] text-red-400/80 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSelectTerm(term)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <History className="w-3 h-3 text-slate-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 pb-2 mb-2 text-xs font-semibold text-slate-400 border-b border-slate-800">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSelectTerm(term)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs border border-amber-500/20 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
