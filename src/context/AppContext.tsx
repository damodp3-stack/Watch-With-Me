import React, { createContext, useContext, useEffect, useState } from 'react';
import { APP_CONFIG } from '../config/app.config';
import { mediaApi } from '../services/api';
import { FilterState, MediaItem, UserPreferences, UserProfile, WatchHistoryItem, WatchlistItem } from '../types';

export type ViewType =
  | 'home'
  | 'movies'
  | 'series'
  | 'anime'
  | 'languages'
  | 'genres'
  | 'watchlist'
  | 'history'
  | 'profile'
  | 'admin';

export interface ActiveModalState {
  type: 'movie-details' | 'series-details' | 'player' | 'trailer' | 'legal';
  mediaId?: string;
  episodeId?: string;
  legalTab?: 'terms' | 'privacy' | 'dmca' | 'compliance';
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'warn';
}

const DEFAULT_FILTERS: FilterState = {
  languages: [],
  genres: [],
  yearRange: [1980, 2026],
  minRating: 0,
  country: 'all',
  contentType: 'all',
  sortBy: 'trending',
};

const DEFAULT_USER: UserProfile = {
  id: 'user-demo-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@cinema.studio',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  createdAt: '2024-01-15T00:00:00.000Z',
  preferences: {
    preferredLanguages: ['Tamil', 'Telugu', 'English', 'Hindi', 'Japanese'],
    theme: 'dark',
    autoplayNextEpisode: true,
    defaultSubtitleLanguage: 'English',
    defaultQuality: '1080p',
    volume: 0.85,
  },
};

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedLanguagePage: string | null;
  setSelectedLanguagePage: (lang: string | null) => void;
  selectedGenrePage: string | null;
  setSelectedGenrePage: (genre: string | null) => void;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  activeModal: ActiveModalState | null;
  openMediaDetails: (media: MediaItem | string) => void;
  openPlayer: (mediaId: string, episodeId?: string) => void;
  openTrailer: (mediaId: string) => void;
  openLegal: (tab?: 'terms' | 'privacy' | 'dmca' | 'compliance') => void;
  closeModal: () => void;

  watchlist: WatchlistItem[];
  addToWatchlist: (mediaId: string) => Promise<void>;
  removeFromWatchlist: (mediaId: string) => Promise<void>;
  isInWatchlist: (mediaId: string) => boolean;

  watchHistory: WatchHistoryItem[];
  recordWatchProgress: (params: {
    mediaId: string;
    episodeId?: string;
    seasonNumber?: number;
    episodeNumber?: number;
    currentTimeSeconds: number;
    durationSeconds: number;
  }) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;

  userProfile: UserProfile;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;

  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;

  toasts: ToastMessage[];
  showToast: (text: string, type?: 'info' | 'success' | 'warn') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedLanguagePage, setSelectedLanguagePage] = useState<string | null>(null);
  const [selectedGenrePage, setSelectedGenrePage] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeModal, setActiveModal] = useState<ActiveModalState | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved =
      localStorage.getItem('watchwithme_profile') ||
      localStorage.getItem('streamora_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(userProfile.preferences.theme || 'dark');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load initial watchlist and history
  useEffect(() => {
    mediaApi.getWatchlist().then(setWatchlist).catch(console.error);
    mediaApi.getHistory().then(setWatchHistory).catch(console.error);
  }, []);

  // Sync theme
  const setTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setThemeState(newTheme);
    updatePreferences({ theme: newTheme });
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  };

  const showToast = (text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    showToast('Filters reset to default', 'info');
  };

  const openMediaDetails = (media: MediaItem | string) => {
    const id = typeof media === 'string' ? media : media.id;
    const type = typeof media === 'string' ? 'movie-details' : (media.type === 'movie' ? 'movie-details' : 'series-details');
    setActiveModal({ type, mediaId: id });
  };

  const openPlayer = (mediaId: string, episodeId?: string) => {
    setActiveModal({ type: 'player', mediaId, episodeId });
  };

  const openTrailer = (mediaId: string) => {
    setActiveModal({ type: 'trailer', mediaId });
  };

  const openLegal = (legalTab: 'terms' | 'privacy' | 'dmca' | 'compliance' = 'terms') => {
    setActiveModal({ type: 'legal', legalTab });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const isInWatchlist = (mediaId: string): boolean => {
    return watchlist.some((item) => item.mediaId === mediaId || item.id === mediaId);
  };

  const addToWatchlist = async (mediaId: string) => {
    try {
      const item = await mediaApi.addToWatchlist(mediaId);
      setWatchlist((prev) => [item, ...prev.filter((w) => w.mediaId !== mediaId)]);
      showToast(`Added to My List`, 'success');
    } catch {
      showToast(`Could not add to watchlist`, 'warn');
    }
  };

  const removeFromWatchlist = async (mediaId: string) => {
    try {
      await mediaApi.removeFromWatchlist(mediaId);
      setWatchlist((prev) => prev.filter((item) => item.mediaId !== mediaId && item.id !== mediaId));
      showToast(`Removed from My List`, 'info');
    } catch {
      showToast(`Could not remove from watchlist`, 'warn');
    }
  };

  const recordWatchProgress = async (params: {
    mediaId: string;
    episodeId?: string;
    seasonNumber?: number;
    episodeNumber?: number;
    currentTimeSeconds: number;
    durationSeconds: number;
  }) => {
    try {
      const record = await mediaApi.saveHistory(params);
      setWatchHistory((prev) => [
        record,
        ...prev.filter((h) => !(h.mediaId === params.mediaId && (params.episodeId ? h.episodeId === params.episodeId : true))),
      ]);
    } catch (err) {
      console.error('Failed to record watch progress', err);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      await mediaApi.deleteHistoryItem(id);
      setWatchHistory((prev) => prev.filter((h) => h.id !== id));
      showToast('Item removed from History', 'info');
    } catch {
      showToast('Failed to remove history item', 'warn');
    }
  };

  const clearAllHistory = async () => {
    try {
      await mediaApi.clearHistory();
      setWatchHistory([]);
      showToast('Watch history cleared', 'info');
    } catch {
      showToast('Failed to clear watch history', 'warn');
    }
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        preferences: { ...prev.preferences, ...prefs },
      };
      localStorage.setItem('watchwithme_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedLanguagePage,
        setSelectedLanguagePage,
        selectedGenrePage,
        setSelectedGenrePage,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        activeModal,
        openMediaDetails,
        openPlayer,
        openTrailer,
        openLegal,
        closeModal,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        watchHistory,
        recordWatchProgress,
        deleteHistoryItem,
        clearAllHistory,
        userProfile,
        updatePreferences,
        theme,
        setTheme,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
