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

export class TmdbProvider implements IMediaProvider {
  id = 'tmdb';
  name = 'The Movie Database (TMDB Live Metadata API)';
  version = '3.0.0';
  isAuthorized = true;
  description = 'Live online metadata provider connected to The Movie Database (TMDB). Provides real-time global movie and TV series metadata, ratings, cast, and posters. (Metadata only; no unauthorized streams).';
  capabilities: ProviderCapabilities = {
    canSearch: true,
    canFilter: true,
    hasSubtitles: false,
    canStream: false,
    supportedTypes: ['movie', 'series'],
  };

  private apiKey: string | undefined;
  private baseUrl = 'https://api.themoviedb.org/3';
  private imageBaseUrl = 'https://image.tmdb.org/t/p';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env.TMDB_API_KEY : undefined);
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private ensureConfigured() {
    if (!this.isConfigured) {
      throw new Error(
        'TMDB Provider is not configured. Please set the TMDB_API_KEY environment variable in .env to enable live TMDB catalog queries.'
      );
    }
  }

  private async fetchTmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    this.ensureConfigured();
    const query = new URLSearchParams({
      api_key: this.apiKey!,
      language: 'en-US',
      ...params,
    });
    const url = `${this.baseUrl}${endpoint}?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Invalid TMDB_API_KEY provided.');
      }
      throw new Error(`TMDB API error HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  private normalizeMovie(m: any): MediaItem {
    return {
      id: `tmdb-m-${m.id}`,
      slug: `tmdb-m-${m.id}`,
      title: m.title || m.original_title || 'Untitled',
      originalTitle: m.original_title,
      type: 'movie',
      poster: m.poster_path ? `${this.imageBaseUrl}/w500${m.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
      backdrop: m.backdrop_path ? `${this.imageBaseUrl}/w1280${m.backdrop_path}` : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      synopsis: m.overview || 'No synopsis available.',
      rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : 7.0,
      votesCount: m.vote_count || 0,
      releaseYear: m.release_date ? parseInt(m.release_date.slice(0, 4), 10) : 2024,
      releaseDate: m.release_date || new Date().toISOString().slice(0, 10),
      runtimeMinutes: m.runtime || 120,
      durationLabel: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : '2h',
      languages: [m.original_language ? m.original_language.toUpperCase() : 'English'],
      originalLanguage: m.original_language || 'en',
      genres: m.genres ? m.genres.map((g: any) => g.name) : ['Drama'],
      country: m.production_countries?.[0]?.name || 'International',
      cast: m.credits?.cast?.slice(0, 5).map((c: any) => ({ name: c.name, role: c.character })) || [],
      contentRating: 'PG-13',
      playbackSources: [],
      subtitleTracks: [],
      isTrending: m.popularity > 50,
    };
  }

  private normalizeTv(t: any): MediaItem {
    return {
      id: `tmdb-s-${t.id}`,
      slug: `tmdb-s-${t.id}`,
      title: t.name || t.original_name || 'Untitled Series',
      originalTitle: t.original_name,
      type: 'series',
      poster: t.poster_path ? `${this.imageBaseUrl}/w500${t.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
      backdrop: t.backdrop_path ? `${this.imageBaseUrl}/w1280${t.backdrop_path}` : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      synopsis: t.overview || 'No synopsis available.',
      rating: t.vote_average ? Math.round(t.vote_average * 10) / 10 : 7.0,
      votesCount: t.vote_count || 0,
      releaseYear: t.first_air_date ? parseInt(t.first_air_date.slice(0, 4), 10) : 2024,
      releaseDate: t.first_air_date || new Date().toISOString().slice(0, 10),
      totalSeasons: t.number_of_seasons || 1,
      seasonsCount: t.number_of_seasons || 1,
      episodesCount: t.number_of_episodes || 10,
      durationLabel: `${t.number_of_seasons || 1} Seasons`,
      languages: [t.original_language ? t.original_language.toUpperCase() : 'English'],
      originalLanguage: t.original_language || 'en',
      genres: t.genres ? t.genres.map((g: any) => g.name) : ['Drama'],
      country: t.origin_country?.[0] || 'International',
      cast: t.credits?.cast?.slice(0, 5).map((c: any) => ({ name: c.name, role: c.character })) || [],
      contentRating: 'TV-14',
      playbackSources: [],
      subtitleTracks: [],
      isTrending: t.popularity > 50,
    };
  }

  async search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]> {
    this.ensureConfigured();
    const data = await this.fetchTmdb<{ results: any[] }>('/search/multi', { query });
    return (data.results || [])
      .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
      .map((r) => (r.media_type === 'movie' ? this.normalizeMovie(r) : this.normalizeTv(r)));
  }

  async getDetails(id: string): Promise<MediaItem | null> {
    this.ensureConfigured();
    if (id.startsWith('tmdb-m-')) {
      const numericId = id.replace('tmdb-m-', '');
      const data = await this.fetchTmdb<any>(`/movie/${numericId}`, { append_to_response: 'credits' });
      return this.normalizeMovie(data);
    } else if (id.startsWith('tmdb-s-')) {
      const numericId = id.replace('tmdb-s-', '');
      const data = await this.fetchTmdb<any>(`/tv/${numericId}`, { append_to_response: 'credits' });
      return this.normalizeTv(data);
    }
    return null;
  }

  async getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    this.ensureConfigured();
    const data = await this.fetchTmdb<{ results: any[] }>('/movie/popular');
    return (data.results || []).map((m) => this.normalizeMovie(m));
  }

  async getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    this.ensureConfigured();
    const data = await this.fetchTmdb<{ results: any[] }>('/tv/popular');
    return (data.results || []).map((t) => this.normalizeTv(t));
  }

  async getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    this.ensureConfigured();
    // TMDB genre 16 = Animation; original_language = ja
    const data = await this.fetchTmdb<{ results: any[] }>('/discover/tv', {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
    });
    return (data.results || []).map((t) => ({ ...this.normalizeTv(t), type: 'anime' }));
  }

  async getTrending(): Promise<MediaItem[]> {
    this.ensureConfigured();
    const data = await this.fetchTmdb<{ results: any[] }>('/trending/all/week');
    return (data.results || [])
      .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
      .map((r) => (r.media_type === 'movie' ? this.normalizeMovie(r) : this.normalizeTv(r)));
  }

  async getRecommendations(mediaId?: string): Promise<MediaItem[]> {
    this.ensureConfigured();
    if (mediaId?.startsWith('tmdb-m-')) {
      const numericId = mediaId.replace('tmdb-m-', '');
      const data = await this.fetchTmdb<{ results: any[] }>(`/movie/${numericId}/recommendations`);
      return (data.results || []).slice(0, 4).map((m) => this.normalizeMovie(m));
    }
    return this.getMovies();
  }

  async getSeasons(seriesId: string): Promise<Season[]> {
    return [];
  }

  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    return [];
  }

  async getPlayback(
    mediaId: string,
    episodeId?: string
  ): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }> {
    // TMDB is strictly a metadata provider. Returning empty sources communicates honest capability.
    return { sources: [], subtitles: [] };
  }

  async getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]> {
    return [];
  }
}
