import React, { useState } from 'react';
import { Compass, Film, Heart, Home, Languages, Layers, Search, Tv, User, X } from 'lucide-react';
import { useApp, ViewType } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { currentView, setCurrentView, setIsSearchOpen, watchlist } = useApp();
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false);

  const isExploreActive = ['movies', 'series', 'anime', 'genres', 'languages'].includes(currentView);

  return (
    <>
      {/* Explore modal on mobile when Explore tab is tapped */}
      {isExploreDrawerOpen && (
        <div
          id="mobile-explore-backdrop"
          onClick={() => setIsExploreDrawerOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200"
        >
          <div
            id="mobile-explore-sheet"
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#0e121a] border-t border-slate-800 rounded-t-3xl p-6 pb-20 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-heading font-bold text-base text-white">Explore Categories</span>
              <button
                type="button"
                onClick={() => setIsExploreDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('movies');
                  setIsExploreDrawerOpen(false);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  currentView === 'movies'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Movies</p>
                  <p className="text-[11px] text-slate-400">Cinema & Hits</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('series');
                  setIsExploreDrawerOpen(false);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  currentView === 'series'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Series</p>
                  <p className="text-[11px] text-slate-400">TV Shows</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('anime');
                  setIsExploreDrawerOpen(false);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  currentView === 'anime'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Anime</p>
                  <p className="text-[11px] text-slate-400">Sub & Dub</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('languages');
                  setIsExploreDrawerOpen(false);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  currentView === 'languages'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Languages</p>
                  <p className="text-[11px] text-slate-400">Regional Cinema</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('genres');
                  setIsExploreDrawerOpen(false);
                }}
                className="col-span-2 flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200"
              >
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">All Genres</p>
                  <p className="text-[11px] text-slate-400">Action, Thriller, Sci-Fi, Drama & more</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main bottom navigation bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080a0f]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around"
      >
        <button
          id="btn-mobile-nav-home"
          type="button"
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'home' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          id="btn-mobile-nav-explore"
          type="button"
          onClick={() => setIsExploreDrawerOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isExploreActive ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>

        <button
          id="btn-mobile-nav-search"
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-amber-400 transition-all"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          id="btn-mobile-nav-watchlist"
          type="button"
          onClick={() => setCurrentView('watchlist')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl relative transition-all ${
            currentView === 'watchlist' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px]">My List</span>
          {watchlist.length > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          id="btn-mobile-nav-profile"
          type="button"
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'profile' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </>
  );
};
