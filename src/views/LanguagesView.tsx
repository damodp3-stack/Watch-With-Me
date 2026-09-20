import React, { useEffect, useState } from 'react';
import { Globe, Languages, Sparkles } from 'lucide-react';
import { EmptyState } from '../components/common/States';
import { MediaCard } from '../components/media/MediaCard';
import { MediaRow } from '../components/media/MediaRow';
import { SUPPORTED_LANGUAGES } from '../config/app.config';
import { useApp } from '../context/AppContext';
import { mediaApi } from '../services/api';
import { MediaItem } from '../types';

export const LanguagesView: React.FC = () => {
  const { selectedLanguagePage, setSelectedLanguagePage } = useApp();
  const [activeLang, setActiveLang] = useState<string>(selectedLanguagePage || 'Tamil');
  const [langMedia, setLangMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if selectedLanguagePage changes from outside
  useEffect(() => {
    if (selectedLanguagePage) {
      setActiveLang(selectedLanguagePage);
    }
  }, [selectedLanguagePage]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mediaApi
      .search('', { languages: [activeLang] })
      .then((data) => {
        if (isMounted) {
          setLangMedia(data);
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
  }, [activeLang]);

  const trendingInLang = langMedia.filter((m) => m.isTrending || m.rating >= 8.4);
  const moviesInLang = langMedia.filter((m) => m.type === 'movie');
  const seriesInLang = langMedia.filter((m) => m.type === 'series' || m.type === 'anime');

  const currentLangObj = SUPPORTED_LANGUAGES.find(
    (l) => l.name.toLowerCase() === activeLang.toLowerCase()
  ) || { name: activeLang, nativeName: activeLang, flag: '🌐' };

  return (
    <div id="languages-hub-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Languages className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Regional & International Cinema
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Immerse yourself in films, shows, and stories categorized by native tongue, dialects, and original soundtracks.
          </p>
        </div>
      </div>

      {/* Language Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = activeLang.toLowerCase() === lang.name.toLowerCase();
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setActiveLang(lang.name);
                setSelectedLanguagePage(lang.name);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.nativeName && lang.nativeName !== lang.name && (
                <span className="opacity-75 font-normal">({lang.nativeName})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Spotlight Title Banner for Active Language */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-amber-950/20 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentLangObj.flag}</span>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white">
                {currentLangObj.name} {currentLangObj.nativeName ? `(${currentLangObj.nativeName})` : ''}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {langMedia.length} Titles available with native audio and subtitles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Feed */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : langMedia.length === 0 ? (
        <EmptyState
          title={`No ${activeLang} titles found`}
          description={`We are continually onboarding authorized ${activeLang} films and series.`}
        />
      ) : (
        <div className="space-y-8">
          {/* Trending in this Language */}
          {trendingInLang.length > 0 && (
            <MediaRow
              id={`trending-${activeLang}`}
              title={`Trending in ${activeLang}`}
              subtitle="Audience favorites and high-demand releases"
              badge="Top Picks"
              items={trendingInLang}
            />
          )}

          {/* Movies in this Language */}
          {moviesInLang.length > 0 && (
            <div>
              <div className="mb-4">
                <h3 className="font-heading font-bold text-xl text-white">
                  {activeLang} Feature Films
                </h3>
                <p className="text-xs text-slate-400">Theatrical releases and movies</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {moviesInLang.map((item) => (
                  <MediaCard key={item.id} media={item} size="md" />
                ))}
              </div>
            </div>
          )}

          {/* Series in this Language */}
          {seriesInLang.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <div className="mb-4">
                <h3 className="font-heading font-bold text-xl text-white">
                  {activeLang} Series & Shows
                </h3>
                <p className="text-xs text-slate-400">Episodic stories and drama series</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {seriesInLang.map((item) => (
                  <MediaCard key={item.id} media={item} size="md" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
