import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Globe,
  Info,
  Languages,
  Play,
  Share2,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mediaApi } from '../../services/api';
import { MediaItem } from '../../types';
import { ContentTypeBadge, QualityBadge, RatingBadge } from '../common/Badge';
import { PlayButton, WatchlistButton } from '../common/Buttons';
import { MediaCard } from '../media/MediaCard';

export const MovieDetailsModal: React.FC<{ mediaId: string }> = ({ mediaId }) => {
  const { closeModal, openPlayer, openTrailer, showToast } = useApp();
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [related, setRelated] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mediaApi
      .getMovieDetails(mediaId)
      .then((data) => {
        if (isMounted && data) {
          setMedia(data);
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

  const handleShare = () => {
    if (navigator.share && media) {
      navigator.share({ title: media.title, text: media.synopsis, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'info');
    }
  };

  return (
    <div
      id="movie-details-modal-backdrop"
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="movie-details-modal-window"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-[#0a0d13] border border-slate-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col relative"
      >
        {/* Close Button */}
        <button
          id="btn-close-movie-details"
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

              {/* Bottom backdrop overlay details */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6">
                {/* Poster thumb on desktop */}
                <div className="hidden sm:block w-36 md:w-44 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl shrink-0 -mb-12 bg-slate-900 z-10">
                  <img src={media.poster} alt={media.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <ContentTypeBadge type={media.type} />
                    <RatingBadge rating={media.rating} size="sm" />
                    <QualityBadge quality="4K UHD" />
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 font-semibold">
                      {media.contentRating}
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
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {media.durationLabel || `${media.runtimeMinutes} min`}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">{media.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Details Body */}
            <div className="p-6 sm:p-8 pt-10 space-y-8">
              {/* Primary action controls */}
              <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-slate-800">
                <PlayButton
                  onClick={() => openPlayer(media.id)}
                  label="Play Movie"
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

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Grid: Synopsis & Metadata Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Synopsis & Cast */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 font-heading">
                      Synopsis
                    </h4>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {media.synopsis}
                    </p>
                  </div>

                  {/* Cast List */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Top Cast & Characters</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {media.cast.map((actor, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80"
                        >
                          <img
                            src={actor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                            alt={actor.name}
                            className="w-10 h-10 rounded-full object-cover bg-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-white truncate">{actor.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{actor.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 1 Col: Production & Language Specs */}
                <div className="space-y-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block">
                      Director
                    </span>
                    <span className="text-white font-medium text-sm">{media.director}</span>
                  </div>

                  {media.writer && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block">
                        Writers
                      </span>
                      <span className="text-slate-200 font-medium">{media.writer}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block">
                      Genres
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {media.genres.map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block">
                      Audio Languages
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {media.languages.map((l) => (
                        <span
                          key={l}
                          className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium text-[11px] border border-amber-500/20"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block">
                      Available Subtitles
                    </span>
                    <p className="text-slate-300 mt-0.5">
                      {media.subtitleTracks.map((s) => s.language).join(', ')}
                    </p>
                  </div>

                  {media.productionCompany && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block">
                        Studio / Production
                      </span>
                      <span className="text-slate-300">{media.productionCompany}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related recommendations */}
              {related.length > 0 && (
                <div className="pt-6 border-t border-slate-800">
                  <h4 className="font-heading font-bold text-lg text-white mb-4">
                    More Like This
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
