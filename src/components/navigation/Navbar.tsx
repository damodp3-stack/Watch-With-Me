import React, { useState } from 'react';
import {
  Bell,
  Compass,
  Film,
  Globe,
  Heart,
  History,
  Languages,
  Layers,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tv,
  User,
} from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';
import { useApp, ViewType } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsSearchOpen,
    setIsFilterDrawerOpen,
    watchlist,
    userProfile,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navLinks: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'movies', label: 'Movies', icon: <Film className="w-4 h-4" /> },
    { id: 'series', label: 'Series', icon: <Tv className="w-4 h-4" /> },
    { id: 'anime', label: 'Anime', icon: <Compass className="w-4 h-4" /> },
    { id: 'genres', label: 'Genres', icon: <Layers className="w-4 h-4" /> },
    { id: 'languages', label: 'Languages', icon: <Languages className="w-4 h-4" /> },
    { id: 'watchlist', label: 'My List', icon: <Heart className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <header
      id="desktop-navbar"
      className="hidden md:block sticky top-0 z-40 w-full bg-[#080a0f]/85 backdrop-blur-xl border-b border-slate-800/60 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8 shrink-0">
          <button
            id="brand-logo-btn"
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/35 transition-all">
              <Film className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-amber-500/80 font-bold -mt-1">
                Cinema Hub
              </span>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
                  }`}
                >
                  {item.label}
                  {item.id === 'watchlist' && watchlist.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      {watchlist.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Quick Filter button */}
          <button
            id="nav-btn-filters"
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            title="Open Advanced Filters"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Filters</span>
          </button>

          {/* Search Trigger */}
          <button
            id="nav-btn-search"
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer group"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline text-slate-400">Search movies, series, cast...</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="nav-btn-notifications"
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="Notifications"
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>

            {isNotifOpen && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-72 p-3 rounded-2xl bg-[#0e121a] border border-slate-800 shadow-2xl z-50 text-xs"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-300 font-semibold">
                  <span>Notifications</span>
                  <span className="text-[10px] text-amber-400">New arrivals</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 cursor-pointer">
                    <p className="font-semibold text-white">Pushpa 2: The Rule</p>
                    <p className="text-slate-400 text-[11px]">Now available in Telugu, Tamil, & Hindi with 4K UHD.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 cursor-pointer">
                    <p className="font-semibold text-white">One Piece: Egghead Arc</p>
                    <p className="text-slate-400 text-[11px]">New episode and English dub track added.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            id="nav-btn-profile"
            type="button"
            onClick={() => setCurrentView('profile')}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-850 transition-all cursor-pointer group"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-7 h-7 rounded-lg object-cover ring-2 ring-slate-800 group-hover:ring-amber-500 transition-all"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
