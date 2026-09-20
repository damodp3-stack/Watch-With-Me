import React, { useEffect, useState } from 'react';
import {
  Clock,
  Compass,
  Film,
  Flame,
  Heart,
  Languages,
  Layers,
  Sparkles,
  TrendingUp,
  Tv,
} from 'lucide-react';
import { HeroSkeleton } from '../components/common/States';
import { HeroBanner } from '../components/media/HeroBanner';
import { MediaCard } from '../components/media/MediaCard';
import { MediaRow } from '../components/media/MediaRow';
import { APP_CONFIG, GENRE_LIST, SUPPORTED_LANGUAGES } from '../config/app.config';
import { useApp } from '../context/AppContext';
import { mediaApi } from '../services/api';
import { MediaItem } from '../types';

export const HomeView: React.FC = () => {
  const {
    setCurrentView,
    setSelectedLanguagePage,
    setSelectedGenrePage,
    setIsFilterDrawerOpen,
    watchHistory,
    watchlist,
    openPlayer,
  } = useApp();

  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [anime, setAnime] = useState<MediaItem[]>([]);
  const [tamilMedia, setTamilMedia] = useState<MediaItem[]>([]);
  const [teluguMedia, setTeluguMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      mediaApi.getTrending(),
      mediaApi.getMovies(),
      mediaApi.getSeries(),
      mediaApi.getAnime(),
      mediaApi.getMovies({ languages: ['Tamil'] }),
      mediaApi.getMovies({ languages: ['Telugu'] }),
    ])
      .then(([trendData, movData, serData, aniData, tamData, telData]) => {
        if (!isMounted) return;
        setTrending(trendData);
        setMovies(movData);
        setSeries(serData);
        setAnime(aniData);
        setTamilMedia(tamData);
        setTeluguMedia(telData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load home page feed', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <HeroSkeleton />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="h-6 bg-slate-900 rounded w-48 animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-48 aspect-[2/3] bg-slate-900 rounded-2xl animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Top featured for hero
  const heroItems = trending.slice(0, 5);

  return (
    <div id="home-view-container" className="space-y-6 pb-16">
      {/* Hero Section */}
      <HeroBanner items={heroItems} />

      {/* Quick Language Spotlight Bar (Requirement 11: Language First Architecture) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30">
        <div className="p-3 sm:p-4 rounded-2xl bg-[#0e121a]/95 border border-slate-800 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <Languages className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Explore by Language:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {SUPPORTED_LANGUAGES.slice(0, 8).map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setSelectedLanguagePage(lang.name);
                  setCurrentView('languages');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-amber-500/15 hover:text-amber-300 text-slate-300 text-xs font-medium border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentView('languages')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 px-2 py-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              All Languages →
            </button>
          </div>
        </div>
      </div>

      {/* Continue Watching Section (Requirement 18) */}
      {watchHistory.length > 0 && (
        <section id="section-continue-watching" className="py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                Continue Watching
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('history')}
              className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
            >
              Watch History
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-2">
              {watchHistory.slice(0, 8).map((record) => {
                const item = record.media;
                if (!item) return null;
                return (
                  <div key={record.id} className="shrink-0">
                    <MediaCard media={item} size="sm" showProgress={record.progressPercent} />
                    <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-slate-400">
                      <span>{record.progressPercent}% finished</span>
                      <button
                        type="button"
                        onClick={() => openPlayer(record.mediaId, record.episodeId)}
                        className="text-amber-400 font-semibold hover:underline cursor-pointer"
                      >
                        Resume
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Trending Now */}
      <MediaRow
        id="trending-now"
        title="Trending Today"
        subtitle="Most watched titles across Tamil, Telugu, Hindi, English and International releases"
        badge="Hot"
        items={trending}
      />

      {/* Regional Spotlight: Tamil Cinema */}
      <MediaRow
        id="tamil-blockbusters"
        title="Tamil Cinema Showcase (தமிழ்)"
        subtitle="Mass action thrillers, intense crime dramas, and acclaimed music scores"
        badge="Regional Hit"
        items={tamilMedia}
        onViewAll={() => {
          setSelectedLanguagePage('Tamil');
          setCurrentView('languages');
        }}
      />

      {/* Popular Movies */}
      <MediaRow
        id="popular-movies"
        title="Featured Movies"
        subtitle="Top rated theatrical hits, benchmark open movies, and licensed originals"
        items={movies}
        onViewAll={() => setCurrentView('movies')}
      />

      {/* Regional Spotlight: Telugu Cinema */}
      <MediaRow
        id="telugu-blockbusters"
        title="Telugu Cinema Showcase (తెలుగు)"
        subtitle="Epic mythology, high-octane spectacles, and pan-Indian sensations"
        badge="Trending"
        items={teluguMedia}
        onViewAll={() => {
          setSelectedLanguagePage('Telugu');
          setCurrentView('languages');
        }}
      />

      {/* Top TV Series */}
      <MediaRow
        id="binge-worthy-series"
        title="Binge-Worthy TV Series"
        subtitle="Multi-season dramas, mystery thrillers, and espionage epics"
        items={series}
        onViewAll={() => setCurrentView('series')}
      />

      {/* Popular Anime */}
      <MediaRow
        id="popular-anime"
        title="Top Anime Series"
        subtitle="Dual audio with Japanese original and multi-lingual dubs"
        badge="Anime"
        items={anime}
        onViewAll={() => setCurrentView('anime')}
      />

      {/* Watchlist Preview (if user has items) */}
      {watchlist.length > 0 && (
        <section id="section-home-watchlist" className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                From Your List
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('watchlist')}
              className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
            >
              View Full List ({watchlist.length})
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-2">
              {watchlist.map((wl) => (
                <MediaCard key={wl.id} media={wl.media} size="sm" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Genre Grid Quick Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-xl text-white">Browse by Genre</h3>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('genres')}
            className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
          >
            All Genres →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {GENRE_LIST.slice(0, 12).map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => {
                setSelectedGenrePage(genre);
                setCurrentView('genres');
              }}
              className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
            >
              <span className="font-heading font-bold text-sm text-slate-200 group-hover:text-amber-400 block transition-colors">
                {genre}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Explore Titles</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
