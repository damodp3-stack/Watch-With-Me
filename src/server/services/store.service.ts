import { MediaItem, WatchHistoryItem, WatchlistItem } from '../../types';

class UserStoreService {
  private watchlist: WatchlistItem[] = [];
  private history: WatchHistoryItem[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed initial demo history and watchlist for realistic testing
    const now = Date.now();
    this.history.push({
      id: 'hist-seed-1',
      userId: 'user-demo-1',
      mediaId: 'open-m-1',
      mediaType: 'movie',
      progressPercent: 45,
      currentTimeSeconds: 405,
      durationSeconds: 900,
      updatedAt: new Date(now - 3600000 * 3).toISOString(),
      media: {
        id: 'open-m-1',
        slug: 'sintel',
        title: 'Sintel',
        type: 'movie',
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        synopsis: 'A lonely young woman searches for her pet baby dragon.',
        rating: 8.8,
        votesCount: 42300,
        releaseYear: 2010,
        releaseDate: '2010-09-27',
        languages: ['English', 'Spanish'],
        originalLanguage: 'English',
        genres: ['Animation', 'Fantasy'],
        country: 'Netherlands',
        cast: [{ name: 'Halina Reijn', role: 'Sintel' }],
        contentRating: 'PG-13',
        playbackSources: [],
        subtitleTracks: [],
      },
    });

    this.watchlist.push({
      id: 'wl-seed-1',
      userId: 'user-demo-1',
      mediaId: 'open-m-2',
      mediaType: 'movie',
      addedAt: new Date(now - 86400000).toISOString(),
      media: {
        id: 'open-m-2',
        slug: 'tears-of-steel',
        title: 'Tears of Steel',
        type: 'movie',
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
        synopsis: 'Set in a dystopian future Amsterdam, freedom fighters attempt to save the earth.',
        rating: 8.5,
        votesCount: 31000,
        releaseYear: 2012,
        releaseDate: '2012-09-12',
        languages: ['English'],
        originalLanguage: 'English',
        genres: ['Sci-Fi', 'Action'],
        country: 'Netherlands',
        cast: [{ name: 'Derek de Lint', role: 'Old Thom' }],
        contentRating: 'PG-13',
        playbackSources: [],
        subtitleTracks: [],
      },
    });
  }

  getWatchlist(userId = 'user-demo-1'): WatchlistItem[] {
    return this.watchlist.filter((item) => item.userId === userId);
  }

  addToWatchlist(userId = 'user-demo-1', media: MediaItem): WatchlistItem {
    const existing = this.watchlist.find(
      (item) => item.userId === userId && item.mediaId === media.id
    );
    if (existing) {
      return existing;
    }

    const newItem: WatchlistItem = {
      id: `wl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      mediaId: media.id,
      mediaType: media.type,
      addedAt: new Date().toISOString(),
      media,
    };
    this.watchlist.unshift(newItem);
    return newItem;
  }

  removeFromWatchlist(userId = 'user-demo-1', targetId: string): boolean {
    const prevLen = this.watchlist.length;
    this.watchlist = this.watchlist.filter(
      (item) => !(item.userId === userId && (item.id === targetId || item.mediaId === targetId))
    );
    return this.watchlist.length < prevLen;
  }

  getHistory(userId = 'user-demo-1'): WatchHistoryItem[] {
    return this.history.filter((item) => item.userId === userId);
  }

  saveHistory(
    userId = 'user-demo-1',
    data: {
      media: MediaItem;
      episodeId?: string;
      seasonNumber?: number;
      episodeNumber?: number;
      progressPercent: number;
      currentTimeSeconds: number;
      durationSeconds: number;
    }
  ): WatchHistoryItem {
    // Remove existing entry for the same media/episode to prevent duplicate history records
    this.history = this.history.filter(
      (h) =>
        !(
          h.userId === userId &&
          h.mediaId === data.media.id &&
          (data.episodeId ? h.episodeId === data.episodeId : true)
        )
    );

    const record: WatchHistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      mediaId: data.media.id,
      mediaType: data.media.type,
      episodeId: data.episodeId,
      seasonNumber: data.seasonNumber,
      episodeNumber: data.episodeNumber,
      progressPercent: Math.min(100, Math.max(0, data.progressPercent)),
      currentTimeSeconds: Math.round(data.currentTimeSeconds),
      durationSeconds: Math.round(data.durationSeconds),
      updatedAt: new Date().toISOString(),
      media: data.media,
    };

    this.history.unshift(record);
    return record;
  }

  removeHistoryItem(userId = 'user-demo-1', targetId: string): boolean {
    const prevLen = this.history.length;
    this.history = this.history.filter(
      (item) => !(item.userId === userId && item.id === targetId)
    );
    return this.history.length < prevLen;
  }

  clearHistory(userId = 'user-demo-1'): void {
    this.history = this.history.filter((item) => item.userId !== userId);
  }
}

export const userStoreService = new UserStoreService();
