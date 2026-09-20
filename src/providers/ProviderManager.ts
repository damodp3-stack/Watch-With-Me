import {
  Episode,
  FilterState,
  MediaItem,
  PlaybackSource,
  ProviderInfo,
  Season,
  SubtitleTrack,
} from '../types';
import { IMediaProvider } from './MediaProvider';
import { MockProvider } from './MockProvider';
import { OpenMediaProvider } from './OpenMediaProvider';
import { TmdbProvider } from './TmdbProvider';

class ProviderManagerService {
  private providers: Map<string, IMediaProvider> = new Map();
  private activeProviderId: string = 'open-media';
  private playbackProviderId: string = 'open-media';
  private fallbackProvider: IMediaProvider;
  private enableMockFallback: boolean = false;

  // Cross-provider mapping for legitimate Creative Commons / Public Domain titles
  private crossProviderPlaybackMap: Record<string, { providerId: string; targetId: string }> = {
    'tmdb-m-45745': { providerId: 'open-media', targetId: 'open-m-1' }, // Sintel
    'tmdb-m-10378': { providerId: 'open-media', targetId: 'open-m-3' }, // Big Buck Bunny
    'tmdb-m-129016': { providerId: 'open-media', targetId: 'open-m-2' }, // Tears of Steel
    'tmdb-m-357441': { providerId: 'open-media', targetId: 'open-m-4' }, // Cosmos Laundromat
  };

  constructor() {
    const openMedia = new OpenMediaProvider();
    const mockProvider = new MockProvider();
    const tmdbProvider = new TmdbProvider();

    this.registerProvider(openMedia);
    this.registerProvider(mockProvider);
    this.registerProvider(tmdbProvider);

    this.fallbackProvider = mockProvider;

    // Detect fallback configuration (default: false to prevent misleading silent fallbacks)
    if (typeof process !== 'undefined' && process.env.ENABLE_MOCK_FALLBACK === 'true') {
      this.enableMockFallback = true;
    }

    // Detect active metadata provider from environment variable if present
    const envProvider = typeof process !== 'undefined' ? process.env.MEDIA_PROVIDER : undefined;
    if (envProvider) {
      const resolved = this.resolveProviderId(envProvider);
      if (this.providers.has(resolved)) {
        this.activeProviderId = resolved;
      }
    }

    // Detect active playback provider from environment variable if present
    const envPlayback = typeof process !== 'undefined' ? process.env.PLAYBACK_PROVIDER : undefined;
    if (envPlayback) {
      const resolved = this.resolveProviderId(envPlayback);
      if (this.providers.has(resolved)) {
        this.playbackProviderId = resolved;
      }
    }
  }

  private resolveProviderId(id: string): string {
    const lower = id.toLowerCase().trim();
    if (lower === 'mock' || lower === 'mock-cinema-provider') return 'mock-cinema-provider';
    if (lower === 'openmedia' || lower === 'open-media') return 'open-media';
    if (lower === 'tmdb') return 'tmdb';
    return id;
  }

  registerProvider(provider: IMediaProvider) {
    this.providers.set(provider.id, provider);
  }

  getProviders(): ProviderInfo[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      version: p.version,
      isAuthorized: p.isAuthorized,
      isConfigured: p.isConfigured,
      description: p.description,
      capabilities: p.capabilities,
    }));
  }

  setActiveProvider(providerId: string): boolean {
    const resolved = this.resolveProviderId(providerId);
    if (this.providers.has(resolved)) {
      this.activeProviderId = resolved;
      return true;
    }
    return false;
  }

  getActiveProvider(): IMediaProvider {
    const provider = this.providers.get(this.activeProviderId);
    if (!provider) {
      return this.fallbackProvider;
    }
    return provider;
  }

  getPlaybackProvider(): IMediaProvider {
    const provider = this.providers.get(this.playbackProviderId);
    return provider || this.providers.get('open-media') || this.fallbackProvider;
  }

  isMockFallbackEnabled(): boolean {
    return this.enableMockFallback;
  }

  setMockFallbackEnabled(enabled: boolean) {
    this.enableMockFallback = enabled;
  }

  /**
   * Execute a metadata operation with strict mode enforcement.
   * If the primary provider fails or is unconfigured, an error is thrown
   * unless ENABLE_MOCK_FALLBACK=true was explicitly configured.
   */
  private async executeOperation<T>(
    operation: (provider: IMediaProvider) => Promise<T>,
    operationName: string
  ): Promise<T> {
    const primary = this.getActiveProvider();

    if (!primary.isConfigured) {
      if (this.enableMockFallback && primary.id !== this.fallbackProvider.id) {
        console.warn(
          `[Watch With Me] Primary provider '${primary.id}' is not configured. Falling back to development provider for ${operationName}.`
        );
        return await operation(this.fallbackProvider);
      }
      throw new Error(
        `Provider '${primary.id}' is not configured. Please verify your environment configuration or choose an active provider.`
      );
    }

    try {
      return await operation(primary);
    } catch (err) {
      if (this.enableMockFallback && primary.id !== this.fallbackProvider.id) {
        console.warn(
          `[Watch With Me] Primary provider '${primary.id}' failed during ${operationName}: ${(err as Error).message}. Using development fallback.`
        );
        return await operation(this.fallbackProvider);
      }
      throw err;
    }
  }

  async search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeOperation((p) => p.search(query, filters), 'search');
  }

  async getDetails(id: string): Promise<MediaItem | null> {
    // If ID belongs to a specific provider prefix, prioritize that provider
    if (id.startsWith('open-')) {
      const openProvider = this.providers.get('open-media');
      if (openProvider) return openProvider.getDetails(id);
    } else if (id.startsWith('mock-')) {
      const mock = this.providers.get('mock-cinema-provider');
      if (mock) return mock.getDetails(id);
    } else if (id.startsWith('tmdb-')) {
      const tmdb = this.providers.get('tmdb');
      if (tmdb && tmdb.isConfigured) return tmdb.getDetails(id);
    }
    return this.executeOperation((p) => p.getDetails(id), 'getDetails');
  }

  async getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeOperation((p) => p.getMovies(filters), 'getMovies');
  }

  async getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeOperation((p) => p.getSeries(filters), 'getSeries');
  }

  async getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeOperation((p) => p.getAnime(filters), 'getAnime');
  }

  async getTrending(): Promise<MediaItem[]> {
    return this.executeOperation(async (p) => {
      if (p.getTrending) return p.getTrending();
      return p.getMovies({ sortBy: 'trending' });
    }, 'getTrending');
  }

  async getRecommendations(mediaId?: string, language?: string): Promise<MediaItem[]> {
    return this.executeOperation(async (p) => {
      if (p.getRecommendations) return p.getRecommendations(mediaId, language);
      return p.getMovies();
    }, 'getRecommendations');
  }

  async getSeasons(seriesId: string): Promise<Season[]> {
    if (seriesId.startsWith('open-')) {
      const open = this.providers.get('open-media');
      if (open) return open.getSeasons(seriesId);
    } else if (seriesId.startsWith('mock-')) {
      const mock = this.providers.get('mock-cinema-provider');
      if (mock) return mock.getSeasons(seriesId);
    } else if (seriesId.startsWith('tmdb-')) {
      const tmdb = this.providers.get('tmdb');
      if (tmdb && tmdb.isConfigured) return tmdb.getSeasons(seriesId);
    }
    return this.executeOperation((p) => p.getSeasons(seriesId), 'getSeasons');
  }

  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    if (seriesId.startsWith('open-')) {
      const open = this.providers.get('open-media');
      if (open) return open.getEpisodes(seriesId, seasonNumber);
    } else if (seriesId.startsWith('mock-')) {
      const mock = this.providers.get('mock-cinema-provider');
      if (mock) return mock.getEpisodes(seriesId, seasonNumber);
    } else if (seriesId.startsWith('tmdb-')) {
      const tmdb = this.providers.get('tmdb');
      if (tmdb && tmdb.isConfigured) return tmdb.getEpisodes(seriesId, seasonNumber);
    }
    return this.executeOperation((p) => p.getEpisodes(seriesId, seasonNumber), 'getEpisodes');
  }

  /**
   * Playback operations are separated from metadata catalog providers.
   * Playback is strictly served for authorized open media, Creative Commons,
   * or explicit cross-provider mapped titles. TMDB commercial items without
   * legitimate streams return empty sources without fabricating stream URLs.
   */
  async getPlayback(
    mediaId: string,
    episodeId?: string
  ): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }> {
    // 1. Check explicit cross-provider mapping
    const mapped = this.crossProviderPlaybackMap[mediaId];
    if (mapped) {
      const mappedProvider = this.providers.get(mapped.providerId);
      if (mappedProvider) {
        return mappedProvider.getPlayback(mapped.targetId, episodeId);
      }
    }

    // 2. Direct ID prefix routing
    if (mediaId.startsWith('open-')) {
      const open = this.providers.get('open-media');
      if (open) return open.getPlayback(mediaId, episodeId);
    }

    if (mediaId.startsWith('mock-')) {
      const mock = this.providers.get('mock-cinema-provider');
      if (mock && (this.activeProviderId === 'mock-cinema-provider' || this.enableMockFallback)) {
        return mock.getPlayback(mediaId, episodeId);
      }
    }

    if (mediaId.startsWith('tmdb-')) {
      // TMDB does not host or license commercial streaming video.
      return { sources: [], subtitles: [] };
    }

    // 3. Fall back to active playback provider
    const playbackProv = this.getPlaybackProvider();
    if (playbackProv.capabilities.playback || playbackProv.capabilities.canStream) {
      return playbackProv.getPlayback(mediaId, episodeId);
    }

    return { sources: [], subtitles: [] };
  }

  async getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]> {
    const pb = await this.getPlayback(mediaId, episodeId);
    return pb.subtitles;
  }
}

export const providerManager = new ProviderManagerService();
