import React from 'react';
import { Clock, History, Play, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/common/States';
import { useApp } from '../context/AppContext';

export const HistoryView: React.FC = () => {
  const { watchHistory, deleteHistoryItem, clearAllHistory, openPlayer, setCurrentView } = useApp();

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div id="history-page-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Watch History & Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Pick up right where you paused, with automatic timestamp synchronization.
            </p>
          </div>
        </div>

        {watchHistory.length > 0 && (
          <button
            type="button"
            onClick={clearAllHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-900/50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {watchHistory.length === 0 ? (
        <EmptyState
          title="No watch history recorded"
          description="Movies or series you play will automatically appear here with progress and resume bookmarks."
          actionLabel="Start Watching"
          onAction={() => setCurrentView('home')}
        />
      ) : (
        <div className="space-y-3">
          {watchHistory.map((item) => {
            const media = item.media;
            if (!media) return null;

            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Thumbnail / Poster */}
                  <div className="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={media.backdrop || media.poster}
                      alt={media.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-400">
                        {item.mediaType}
                      </span>
                      {item.episodeNumber && (
                        <span className="text-xs font-semibold text-slate-300">
                          S{item.seasonNumber || 1}:E{item.episodeNumber}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">• {formatDate(item.updatedAt)}</span>
                    </div>

                    <h4 className="font-heading font-semibold text-sm sm:text-base text-white truncate">
                      {media.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="text-amber-400 font-semibold">{item.progressPercent}% watched</span>
                      <span>•</span>
                      <span>
                        {formatDuration(item.currentTimeSeconds)} / {formatDuration(item.durationSeconds)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => openPlayer(item.mediaId, item.episodeId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteHistoryItem(item.id)}
                    title="Remove item"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
