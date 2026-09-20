import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { EmptyState } from '../components/common/States';
import { MediaCard } from '../components/media/MediaCard';
import { GENRE_LIST } from '../config/app.config';
import { useApp } from '../context/AppContext';
import { mediaApi } from '../services/api';
import { MediaItem } from '../types';

export const GenresView: React.FC = () => {
  const { selectedGenrePage, setSelectedGenrePage } = useApp();
  const [activeGenre, setActiveGenre] = useState<string>(selectedGenrePage || 'Action');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedGenrePage) {
      setActiveGenre(selectedGenrePage);
    }
  }, [selectedGenrePage]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mediaApi
      .search('', { genres: [activeGenre] })
      .then((data) => {
        if (isMounted) {
          setItems(data);
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
  }, [activeGenre]);

  return (
    <div id="genres-page-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Browse by Genre
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Filter cinema by narrative style, atmosphere, and cinematic themes.
            </p>
          </div>
        </div>
      </div>

      {/* Genre pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {GENRE_LIST.map((genre) => {
          const isSelected = activeGenre.toLowerCase() === genre.toLowerCase();
          return (
            <button
              key={genre}
              type="button"
              onClick={() => {
                setActiveGenre(genre);
                setSelectedGenrePage(genre);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Genre Section Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="font-heading font-bold text-xl text-white">
          {activeGenre} ({items.length} {items.length === 1 ? 'Title' : 'Titles'})
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${activeGenre} titles found`}
          description="Check back soon as new licensed titles are added."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {items.map((item) => (
            <MediaCard key={item.id} media={item} size="md" />
          ))}
        </div>
      )}
    </div>
  );
};
