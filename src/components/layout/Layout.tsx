import React from 'react';
import { ToastContainer } from '../common/ToastContainer';
import { FilterDrawer } from '../filters/FilterDrawer';
import { LegalModal } from '../modals/LegalModal';
import { MovieDetailsModal } from '../modals/MovieDetailsModal';
import { SeriesDetailsModal } from '../modals/SeriesDetailsModal';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { MobileNavbar } from '../navigation/MobileNavbar';
import { Navbar } from '../navigation/Navbar';
import { TrailerModal } from '../player/TrailerModal';
import { VideoPlayerModal } from '../player/VideoPlayerModal';
import { SearchModal } from '../search/SearchModal';
import { Footer } from './Footer';

import { useApp } from '../../context/AppContext';
import { AnimeView } from '../../views/AnimeView';
import { GenresView } from '../../views/GenresView';
import { HistoryView } from '../../views/HistoryView';
import { HomeView } from '../../views/HomeView';
import { LanguagesView } from '../../views/LanguagesView';
import { MoviesView } from '../../views/MoviesView';
import { ProfileView } from '../../views/ProfileView';
import { SeriesView } from '../../views/SeriesView';
import { WatchlistView } from '../../views/WatchlistView';

export const Layout: React.FC = () => {
  const { currentView, activeModal } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'movies':
        return <MoviesView />;
      case 'series':
        return <SeriesView />;
      case 'anime':
        return <AnimeView />;
      case 'languages':
        return <LanguagesView />;
      case 'genres':
        return <GenresView />;
      case 'watchlist':
        return <WatchlistView />;
      case 'history':
        return <HistoryView />;
      case 'profile':
        return <ProfileView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Desktop Header */}
      <Navbar />

      {/* Mobile Top Header */}
      <MobileNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">{renderView()}</main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Modals & Drawers */}
      <FilterDrawer />
      <SearchModal />

      {/* Dynamic Detail / Player Modals */}
      {activeModal?.type === 'movie-details' && activeModal.mediaId && (
        <MovieDetailsModal mediaId={activeModal.mediaId} />
      )}
      {activeModal?.type === 'series-details' && activeModal.mediaId && (
        <SeriesDetailsModal mediaId={activeModal.mediaId} />
      )}
      {activeModal?.type === 'player' && activeModal.mediaId && (
        <VideoPlayerModal mediaId={activeModal.mediaId} episodeId={activeModal.episodeId} />
      )}
      {activeModal?.type === 'trailer' && activeModal.mediaId && (
        <TrailerModal mediaId={activeModal.mediaId} />
      )}
      {activeModal?.type === 'legal' && (
        <LegalModal initialTab={activeModal.legalTab} />
      )}

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};
