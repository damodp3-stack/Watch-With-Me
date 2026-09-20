import React from 'react';
import { AlertCircle, Film, RefreshCw, SearchX } from 'lucide-react';

export const MediaCardSkeleton: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-2xl bg-slate-900/60 border border-slate-800/60 animate-pulse overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-3.5 bg-slate-800 rounded w-3/4" />
        <div className="h-2.5 bg-slate-800/60 rounded w-1/2" />
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[55vh] sm:h-[70vh] max-h-[720px] bg-slate-900 animate-pulse flex items-end p-6 sm:p-12">
      <div className="space-y-4 max-w-xl w-full">
        <div className="h-4 bg-slate-800 rounded w-32" />
        <div className="h-10 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800/80 rounded w-full" />
        <div className="h-4 bg-slate-800/80 rounded w-2/3" />
        <div className="flex gap-3 pt-2">
          <div className="h-11 bg-slate-800 rounded-xl w-32" />
          <div className="h-11 bg-slate-800 rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({
  title = 'No Titles Found',
  description = 'Try adjusting your filters, selecting other languages, or searching with another keyword.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div id="empty-state-view" className="flex flex-col items-center justify-center text-center p-8 sm:p-14 my-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 max-w-lg mx-auto">
      <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 mb-4">
        {icon || <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          id="btn-empty-state-action"
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-all cursor-pointer shadow-md shadow-amber-500/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({
  message = 'Failed to load media catalog. Please check your connection and retry.',
  onRetry,
}) => {
  return (
    <div id="error-state-view" className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-6 rounded-3xl bg-red-950/20 border border-red-900/30 max-w-md mx-auto">
      <div className="p-4 rounded-2xl bg-red-500/10 text-red-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-5">{message}</p>
      {onRetry && (
        <button
          id="btn-error-retry"
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
