import { ALL_MEDIA, MOCK_ANIME, MOCK_MOVIES, MOCK_SERIES } from '../data/mockData';
import {
  Episode,
  FilterState,
  MediaItem,
  PlaybackSource,
  ProviderCapabilities,
  Season,
  SubtitleTrack,
} from '../types';
import { IMediaProvider } from './MediaProvider';

export class MockProvider implements IMediaProvider {
  id = 'mock-cinema-provider';
  name = 'Watch With Me Development Catalog (Offline Mock)';
  version = '1.0.0';
  isAuthorized = true;
  isConfigured = true;
  description = 'Development fallback provider serving demo titles, sample Creative Commons video streams, and deterministic mock datasets.';
  capabilities: ProviderCapabilities = {
    canSearch: true,
    canFilter: true,
    hasSubtitles: true,
    canStream: true,
    supportedTypes: ['movie', 'series', 'anime'],
  };

  private filterList(items: MediaItem[], filters?: Partial<FilterState>): MediaItem[] {
    if (!filters) return items;

    let result = [...items];

    if (filters.languages && filters.languages.length > 0) {
      result = result.filter((item) =>
        filters.languages!.some(
          (lang) =>
            item.languages.map((l) => l.toLowerCase()).includes(lang.toLowerCase()) ||
            item.originalLanguage.toLowerCase() === lang.toLowerCase()
        )
      );
    }

    if (filters.genres && filters.genres.length > 0) {
      result = result.filter((item) =>
        filters.genres!.some((genre) =>
          item.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
        )
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      result = result.filter((item) => item.rating >= filters.minRating!);
    }

    if (filters.yearRange && (filters.yearRange[0] > 1900 || filters.yearRange[1] < 2030)) {
      result = result.filter(
        (item) =>
          item.releaseYear >= filters.yearRange![0] && item.releaseYear <= filters.yearRange![1]
      );
    }

    if (filters.country && filters.country !== 'all') {
      result = result.filter(
        (item) => item.country.toLowerCase() === filters.country!.toLowerCase()
      );
    }

    if (filters.contentType && filters.contentType !== 'all') {
      result = result.filter((item) => item.type === filters.contentType);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'trending':
        default:
          result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.rating - a.rating);
          break;
      }
    }

    return result;
  }

  async search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]> {
    const q = query.trim().toLowerCase();
    let matched = ALL_MEDIA.filter((item) => {
      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q);
      const originalTitleMatch = item.originalTitle?.toLowerCase().includes(q) ?? false;
      const castMatch = item.cast.some((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
      const directorMatch = item.director?.toLowerCase().includes(q) ?? false;
      const genreMatch = item.genres.some((g) => g.toLowerCase().includes(q));
      const languageMatch = item.languages.some((l) => l.toLowerCase().includes(q));
      return titleMatch || originalTitleMatch || castMatch || directorMatch || genreMatch || languageMatch;
    });

    return this.filterList(matched, filters);
  }

  async getDetails(id: string): Promise<MediaItem | null> {
    const item = ALL_MEDIA.find((m) => m.id === id || m.slug === id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.filterList(MOCK_MOVIES, filters);
  }

  async getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.filterList(MOCK_SERIES, filters);
  }

  async getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.filterList(MOCK_ANIME, filters);
  }

  async getTrending(): Promise<MediaItem[]> {
    return ALL_MEDIA.filter((item) => item.isTrending || item.rating >= 8.5);
  }

  async getRecommendations(mediaId?: string, language?: string): Promise<MediaItem[]> {
    if (language) {
      const match = ALL_MEDIA.filter((m) =>
        m.languages.map((l) => l.toLowerCase()).includes(language.toLowerCase())
      );
      if (match.length > 0) return match.slice(0, 4);
    }
    return ALL_MEDIA.filter((m) => m.id !== mediaId).slice(0, 4);
  }

  async getSeasons(seriesId: string): Promise<Season[]> {
    const item = ALL_MEDIA.find((m) => m.id === seriesId);
    return item?.seasons ? JSON.parse(JSON.stringify(item.seasons)) : [];
  }

  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    const seasons = await this.getSeasons(seriesId);
    const season = seasons.find((s) => s.seasonNumber === seasonNumber);
    return season ? season.episodes : [];
  }

  async getPlayback(
    mediaId: string,
    episodeId?: string
  ): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }> {
    const item = await this.getDetails(mediaId);
    if (!item) {
      throw new Error(`Media with ID ${mediaId} not found`);
    }

    if (episodeId && item.seasons) {
      for (const season of item.seasons) {
        const ep = season.episodes.find((e) => e.id === episodeId);
        if (ep) {
          return {
            sources: ep.playbackSources,
            subtitles: ep.subtitleTracks,
          };
        }
      }
    }

    return {
      sources: item.playbackSources,
      subtitles: item.subtitleTracks,
    };
  }

  async getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]> {
    const playback = await this.getPlayback(mediaId, episodeId);
    return playback.subtitles;
  }
}
