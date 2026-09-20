import React from 'react';
import { Film, Search, SlidersHorizontal } from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';
import { useApp } from '../../context/AppContext';

export const MobileNavbar: React.FC = () => {
  const { setCurrentView, setIsSearchOpen, setIsFilterDrawerOpen, userProfile } = useApp();

  return (
    <header
      id="mobile-top-navbar"
      className="md:hidden sticky top-0 z-40 w-full bg-[#080a0f]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between"
    >
      <button
        id="mobile-brand-btn"
        type="button"
        onClick={() => setCurrentView('home')}
        className="flex items-center gap-2 cursor-pointer focus:outline-none"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
          <Film className="w-4 h-4 text-slate-950 fill-slate-950" />
        </div>
        <span className="font-heading font-black text-lg tracking-tight text-white">
          {APP_CONFIG.name}
        </span>
      </button>

      <div className="flex items-center gap-2">
        <button
          id="mobile-btn-search"
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-800"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          id="mobile-btn-filters"
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          className="p-2 rounded-xl bg-slate-900/90 text-amber-400 border border-slate-800"
          aria-label="Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <button
          id="mobile-btn-profile-top"
          type="button"
          onClick={() => setCurrentView('profile')}
          className="p-0.5 rounded-lg ring-1 ring-slate-700"
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-7 h-7 rounded-md object-cover"
          />
        </button>
      </div>
    </header>
  );
};
