import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Film,
  Layers,
  Play,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mediaApi } from '../../services/api';
import { Episode, MediaItem, Season } from '../../types';
import { ContentTypeBadge, QualityBadge, RatingBadge } from '../common/Badge';
import { PlayButton, WatchlistButton } from '../common/Buttons';
import { MediaCard } from '../media/MediaCard';

export const SeriesDetailsModal: React.FC<{ mediaId: string }> = ({ mediaId }) => {
  const { closeModal, openPlayer, openTrailer, showToast } = useApp();
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [related, setRelated] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mediaApi
      .getMovieDetails(mediaId) // works for series/anime as well
      .then((data) => {
        if (isMounted && data) {
          setMedia(data);
          if (data.seasons && data.seasons.length > 0) {
            setSelectedSeasonNumber(data.seasons[0].seasonNumber);
          }
          return mediaApi.getRecommendations(data.id);
        }
        return [];
      })
      .then((recs) => {
        if (isMounted) {
          setRelated(recs);
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
  }, [mediaId]);

  if (!media && !loading) return null;

  const currentSeason = media?.seasons?.find((s) => s.seasonNumber === selectedSeasonNumber);

  return (
    <div
      id="series-details-modal-backdrop"
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="series-details-modal-window"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-[#0a0d13] border border-slate-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col relative"
      >
        <button
          id="btn-close-series-details"
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !media ? (
          <div className="p-16 flex items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-y-auto custom-scrollbar">
            {/* Backdrop header banner */}
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              <img
                src={media.backdrop}
                alt={media.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d13] via-[#0a0d13]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d13] via-transparent to-transparent w-2/3" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6">
                <div className="hidden sm:block w-36 md:w-44 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl shrink-0 -mb-12 bg-slate-900 z-10">
                  <img src={media.poster} alt={media.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <ContentTypeBadge type={media.type} />
                    <RatingBadge rating={media.rating} size="sm" />
                    <QualityBadge quality="1080p HD" />
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 font-semibold">
                      {media.totalSeasons ? `${media.totalSeasons} Seasons` : 'TV Series'}
                    </span>
                  </div>

                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
                    {media.title}
                  </h2>

                  {media.originalTitle && media.originalTitle !== media.title && (
                    <p className="text-sm font-medium text-amber-400">
                      Original Title: {media.originalTitle} ({media.originalLanguage})
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {media.releaseYear}
                    </span>
                    <span>•</span>
                    <span className="text-amber-300">{media.languages.join(', ')}</span>
                    <span>•</span>
                    <span className="text-slate-400">{media.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 pt-10 space-y-8">
              {/* Primary action row */}
              <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-slate-800">
                <PlayButton
                  onClick={() => {
                    const firstEp = currentSeason?.episodes[0];
                    openPlayer(media.id, firstEp?.id);
                  }}
                  label={`Watch S${selectedSeasonNumber} E1`}
                  size="lg"
                />

                {media.trailerUrl && (
                  <button
                    type="button"
                    onClick={() => openTrailer(media.id)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Film className="w-4 h-4 text-amber-400" />
                    <span>Watch Trailer</span>
                  </button>
                )}

                <WatchlistButton mediaId={media.id} variant="full" />
              </div>

              {/* Synopsis & Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-heading">
                  Series Overview
                </h4>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
                  {media.synopsis}
                </p>
              </div>

              {/* Seasons & Episodes Selector (Requirement 14 & 15) */}
              <div className="pt-4 border-t border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h3 className="font-heading font-bold text-lg text-white">Episodes</h3>
                  </div>

                  {/* Season switcher tabs */}
                  {media.seasons && media.seasons.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {media.seasons.map((season) => (
                        <button
                          key={season.seasonNumber}
                          type="button"
                          onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            selectedSeasonNumber === season.seasonNumber
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          Season {season.seasonNumber}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Episode cards list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSeason?.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      id={`episode-card-${episode.id}`}
                      onClick={() => openPlayer(media.id, episode.id)}
                      className="group flex gap-3.5 p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer"
                    >
                      {/* Thumbnail with hover play icon */}
                      <div className="relative w-32 sm:w-36 aspect-video rounded-xl overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={episode.thumbnail}
                          alt={episode.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 rounded-full bg-amber-500 text-slate-950">
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-medium">
                          {episode.durationMinutes}m
                        </span>
                      </div>

                      {/* Episode info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-amber-400">
                              EP {episode.episodeNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {episode.airDate || media.releaseYear}
                            </span>
                          </div>
                          <h5 className="font-heading font-semibold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                            {episode.title}
                          </h5>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-normal">
                            {episode.overview}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="pt-6 border-t border-slate-800">
                  <h4 className="font-heading font-bold text-lg text-white mb-4">
                    More Shows Like This
                  </h4>
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                    {related.map((item) => (
                      <MediaCard key={item.id} media={item} size="sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
