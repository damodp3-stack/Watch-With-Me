import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../../types';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  id: string;
  title: string;
  items: MediaItem[];
  subtitle?: string;
  badge?: string;
  onViewAll?: () => void;
}

export const MediaRow: React.FC<MediaRowProps> = ({
  id,
  title,
  items,
  subtitle,
  badge,
  onViewAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const distance = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section id={`section-${id}`} className="py-4 sm:py-6 relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-white tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors mr-2 cursor-pointer"
            >
              See All
            </button>
          )}

          {/* Desktop Arrow Nav */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              title="Scroll left"
              className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              title="Scroll right"
              className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 pb-2"
        >
          {items.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
