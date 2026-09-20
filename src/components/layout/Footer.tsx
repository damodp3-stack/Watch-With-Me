import React from 'react';
import { Film, Globe, Heart, ShieldAlert, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, openLegal } = useApp();

  return (
    <footer id="app-footer" className="w-full bg-[#06080c] border-t border-slate-800/80 pt-12 pb-24 md:pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Film className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-heading font-extrabold text-lg text-white">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              A modern, multilingual cinema and television discovery hub. Designed for regional
              storytelling and international benchmark media.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Authorized & Public Domain Streams</span>
            </div>
          </div>

          {/* Media Links */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Explore Catalog
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('movies')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Feature Films & Movies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('series')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  TV Shows & Series
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('anime')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Anime Hub
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('languages')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Regional Languages
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('genres')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Browse by Genre
                </button>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Spotlight Languages
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-slate-400">
              {['Tamil Cinema', 'Telugu Cinema', 'Hindi Cinema', 'Malayalam', 'Japanese Anime', 'Korean Drama'].map(
                (l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setCurrentView('languages')}
                    className="text-left hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {l}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Legal & Compliance
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => openLegal('terms')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal('privacy')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal('dmca')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  DMCA Copyright Takedown
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal('compliance')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Authorized Media Notice
                </button>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                Contact: <span className="text-slate-400">{APP_CONFIG.legalContactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>{APP_CONFIG.copyrightNotice}</p>
          <div className="flex items-center gap-4">
            <span>Version {APP_CONFIG.version}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for Cinephiles
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
