import React, { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mediaApi } from '../../services/api';
import { MediaItem } from '../../types';

export const TrailerModal: React.FC<{ mediaId: string }> = ({ mediaId }) => {
  const { closeModal, openPlayer } = useApp();
  const [media, setMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    mediaApi.getMovieDetails(mediaId).then(setMedia);
  }, [mediaId]);

  if (!media) return null;

  return (
    <div
      id="trailer-modal-backdrop"
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200"
    >
      <div
        id="trailer-modal-window"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#0e121a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
              Official Teaser / Trailer
            </span>
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              {media.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={media.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
            title={`${media.title} Official Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer info & Play Full Movie CTA */}
        <div className="p-4 sm:p-5 bg-slate-900/60 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
            {media.synopsis}
          </p>
          <button
            type="button"
            onClick={() => {
              closeModal();
              openPlayer(media.id);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Feature Film</span>
          </button>
        </div>
      </div>
    </div>
  );
};
