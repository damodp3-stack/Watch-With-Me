import { APP_CONFIG } from '../config/app.config';
import { providerManager } from '../providers/ProviderManager';
import {
  ApiResponse,
  Episode,
  FilterState,
  MediaItem,
  PlaybackSource,
  ProviderInfo,
  Season,
  SubtitleTrack,
  WatchHistoryItem,
  WatchlistItem,
} from '../types';

const STORAGE_KEYS = {
  watchlist: 'watchwithme_watchlist',
  legacyWatchlist: 'streamora_watchlist',
  history: 'watchwithme_history',
  legacyHistory: 'streamora_history',
};

class MediaApiService {
  private baseUrl = APP_CONFIG.apiBaseUrl;

  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`[Watch With Me API] Falling back to providerManager for: ${url}`, err);
      throw err;
    }
  }

  async getHealth(): Promise<any> {
    try {
      const res = await this.fetchJson<ApiResponse<any>>(`${this.baseUrl}/health`);
      return res.data;
    } catch {
      const active = providerManager.getActiveProvider();
      return {
        status: 'ok',
        app: APP_CONFIG.name,
        version: APP_CONFIG.version,
        activeProvider: {
          id: active.id,
          name: active.name,
          isConfigured: active.isConfigured,
          capabilities: active.capabilities,
        },
      };
    }
  }

  async getProviders(): Promise<{ activeProviderId: string; providers: ProviderInfo[] }> {
    try {
      const res = await this.fetchJson<ApiResponse<{ activeProviderId: string; providers: ProviderInfo[] }>>(
        `${this.baseUrl}/providers`
      );
      return res.data;
    } catch {
      return {
        activeProviderId: providerManager.getActiveProvider().id,
        providers: providerManager.getProviders(),
      };
    }
  }

  async setActiveProvider(providerId: string): Promise<boolean> {
    try {
      const res = await this.fetchJson<ApiResponse<{ activeProviderId: string }>>(
        `${this.baseUrl}/providers/active`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ providerId }),
        }
      );
      return res.success;
    } catch {
      return providerManager.setActiveProvider(providerId);
    }
  }

  async getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.languages?.length) params.set('languages', filters.languages.join(','));
      if (filters?.genres?.length) params.set('genres', filters.genres.join(','));
      if (filters?.minRating) params.set('minRating', filters.minRating.toString());
      if (filters?.sortBy) params.set('sortBy', filters.sortBy);
      if (filters?.yearRange) {
        params.set('minYear', filters.yearRange[0].toString());
        params.set('maxYear', filters.yearRange[1].toString());
      }
      if (filters?.country) params.set('country', filters.country);
      const res = await this.fetchJson<ApiResponse<MediaItem[]>>(`${this.baseUrl}/movies?${params.toString()}`);
      return res.data;
    } catch {
      return providerManager.getMovies(filters);
    }
  }

  async getMovieDetails(id: string): Promise<MediaItem | null> {
    try {
      const res = await this.fetchJson<ApiResponse<MediaItem>>(`${this.baseUrl}/movies/${id}`);
      return res.data;
    } catch {
      return providerManager.getDetails(id);
    }
  }

  async getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.languages?.length) params.set('languages', filters.languages.join(','));
      if (filters?.genres?.length) params.set('genres', filters.genres.join(','));
      if (filters?.minRating) params.set('minRating', filters.minRating.toString());
      if (filters?.sortBy) params.set('sortBy', filters.sortBy);
      if (filters?.yearRange) {
        params.set('minYear', filters.yearRange[0].toString());
        params.set('maxYear', filters.yearRange[1].toString());
      }
      if (filters?.country) params.set('country', filters.country);
      const res = await this.fetchJson<ApiResponse<MediaItem[]>>(`${this.baseUrl}/series?${params.toString()}`);
      return res.data;
    } catch {
      return providerManager.getSeries(filters);
    }
  }

  async getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.languages?.length) params.set('languages', filters.languages.join(','));
      if (filters?.genres?.length) params.set('genres', filters.genres.join(','));
      if (filters?.minRating) params.set('minRating', filters.minRating.toString());
      if (filters?.sortBy) params.set('sortBy', filters.sortBy);
      if (filters?.yearRange) {
        params.set('minYear', filters.yearRange[0].toString());
        params.set('maxYear', filters.yearRange[1].toString());
      }
      if (filters?.country) params.set('country', filters.country);
      const res = await this.fetchJson<ApiResponse<MediaItem[]>>(`${this.baseUrl}/anime?${params.toString()}`);
      return res.data;
    } catch {
      return providerManager.getAnime(filters);
    }
  }

  async search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (filters?.contentType) params.set('contentType', filters.contentType);
      if (filters?.languages?.length) params.set('languages', filters.languages.join(','));
      if (filters?.genres?.length) params.set('genres', filters.genres.join(','));
      if (filters?.minRating) params.set('minRating', filters.minRating.toString());
      if (filters?.sortBy) params.set('sortBy', filters.sortBy);

      const res = await this.fetchJson<ApiResponse<MediaItem[]>>(`${this.baseUrl}/search?${params.toString()}`);
      return res.data;
    } catch {
      return providerManager.search(query, filters);
    }
  }

  async getTrending(): Promise<MediaItem[]> {
    try {
      const res = await this.fetchJson<ApiResponse<MediaItem[]>>(`${this.baseUrl}/trending`);
      return res.data;
    } catch {
      return providerManager.getTrending();
    }
  }

  async getRecommendations(mediaId?: string, language?: string): Promise<MediaItem[]> {
    try {
      const params = new URLSearchParams();
      if (mediaId) params.set('mediaId', mediaId);
      if (language) params.set('language', language);
      const url = `${this.baseUrl}/recommendations?${params.toString()}`;
      const res = await this.fetchJson<ApiResponse<MediaItem[]>>(url);
      return res.data;
    } catch {
      return providerManager.getRecommendations(mediaId, language);
    }
  }

  async getSeasons(seriesId: string): Promise<Season[]> {
    try {
      const res = await this.fetchJson<ApiResponse<Season[]>>(`${this.baseUrl}/series/${seriesId}/seasons`);
      return res.data;
    } catch {
      return providerManager.getSeasons(seriesId);
    }
  }

  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    try {
      const res = await this.fetchJson<ApiResponse<Episode[]>>(
        `${this.baseUrl}/series/${seriesId}/seasons/${seasonNumber}/episodes`
      );
      return res.data;
    } catch {
      return providerManager.getEpisodes(seriesId, seasonNumber);
    }
  }

  async getPlayback(
    mediaId: string,
    episodeId?: string
  ): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }> {
    try {
      const url = episodeId
        ? `${this.baseUrl}/playback/${mediaId}?episodeId=${episodeId}`
        : `${this.baseUrl}/playback/${mediaId}`;
      const res = await this.fetchJson<ApiResponse<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }>>(url);
      return res.data;
    } catch {
      return providerManager.getPlayback(mediaId, episodeId);
    }
  }

  async getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]> {
    try {
      const url = episodeId
        ? `${this.baseUrl}/subtitles/${mediaId}?episodeId=${episodeId}`
        : `${this.baseUrl}/subtitles/${mediaId}`;
      const res = await this.fetchJson<ApiResponse<SubtitleTrack[]>>(url);
      return res.data;
    } catch {
      return providerManager.getSubtitles(mediaId, episodeId);
    }
  }

  // Watchlist with localStorage fallback and migration
  async getWatchlist(): Promise<WatchlistItem[]> {
    try {
      const res = await this.fetchJson<ApiResponse<WatchlistItem[]>>(`${this.baseUrl}/watchlist`);
      return res.data;
    } catch {
      const local =
        localStorage.getItem(STORAGE_KEYS.watchlist) ||
        localStorage.getItem(STORAGE_KEYS.legacyWatchlist);
      return local ? JSON.parse(local) : [];
    }
  }

  async addToWatchlist(mediaId: string): Promise<WatchlistItem> {
    try {
      const res = await this.fetchJson<ApiResponse<WatchlistItem>>(`${this.baseUrl}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
      });
      return res.data;
    } catch {
      const media = (await providerManager.getDetails(mediaId))!;
      const item: WatchlistItem = {
        id: `wl-${Date.now()}`,
        userId: 'user-demo-1',
        mediaId,
        mediaType: media.type,
        addedAt: new Date().toISOString(),
        media,
      };
      const list = await this.getWatchlist();
      list.unshift(item);
      localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(list));
      return item;
    }
  }

  async removeFromWatchlist(mediaIdOrId: string): Promise<void> {
    try {
      await this.fetchJson(`${this.baseUrl}/watchlist/${mediaIdOrId}`, { method: 'DELETE' });
    } catch {
      const list = (await this.getWatchlist()).filter((w) => w.id !== mediaIdOrId && w.mediaId !== mediaIdOrId);
      localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(list));
    }
  }

  // History & Continue Watching with localStorage fallback and migration
  async getHistory(): Promise<WatchHistoryItem[]> {
    try {
      const res = await this.fetchJson<ApiResponse<WatchHistoryItem[]>>(`${this.baseUrl}/history`);
      return res.data;
    } catch {
      const local =
        localStorage.getItem(STORAGE_KEYS.history) ||
        localStorage.getItem(STORAGE_KEYS.legacyHistory);
      return local ? JSON.parse(local) : [];
    }
  }

  async saveHistory(params: {
    mediaId: string;
    episodeId?: string;
    seasonNumber?: number;
    episodeNumber?: number;
    currentTimeSeconds: number;
    durationSeconds: number;
  }): Promise<WatchHistoryItem> {
    try {
      const res = await this.fetchJson<ApiResponse<WatchHistoryItem>>(`${this.baseUrl}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return res.data;
    } catch {
      const media = (await providerManager.getDetails(params.mediaId))!;
      const percent =
        params.durationSeconds > 0
          ? Math.min(100, Math.round((params.currentTimeSeconds / params.durationSeconds) * 100))
          : 0;
      const record: WatchHistoryItem = {
        id: `hist-${Date.now()}`,
        userId: 'user-demo-1',
        mediaId: params.mediaId,
        mediaType: media.type,
        episodeId: params.episodeId,
        seasonNumber: params.seasonNumber,
        episodeNumber: params.episodeNumber,
        progressPercent: percent,
        currentTimeSeconds: Math.round(params.currentTimeSeconds),
        durationSeconds: Math.round(params.durationSeconds),
        updatedAt: new Date().toISOString(),
        media,
      };
      const list = (await this.getHistory()).filter(
        (h) => !(h.mediaId === params.mediaId && (params.episodeId ? h.episodeId === params.episodeId : true))
      );
      list.unshift(record);
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(list));
      return record;
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await this.fetchJson(`${this.baseUrl}/history`, { method: 'DELETE' });
    } catch {
      localStorage.removeItem(STORAGE_KEYS.history);
      localStorage.removeItem(STORAGE_KEYS.legacyHistory);
    }
  }

  async deleteHistoryItem(id: string): Promise<void> {
    try {
      await this.fetchJson(`${this.baseUrl}/history/${id}`, { method: 'DELETE' });
    } catch {
      const list = (await this.getHistory()).filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(list));
    }
  }
}

export const mediaApi = new MediaApiService();
